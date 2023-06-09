import fs from "fs-extra";
import ora from "ora";
import { formatError } from "./errors";
import type { Context, FileType } from "~types";
import path from "path";
/**
 * Creates a directory if it doesn't already exists in filesystem
 */
export const existsOrCreate = async (path: string) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    await fs.mkdir(path);
  }
  return false;
};

/**
 * Accepts a path to a directory and deletes its content
 */
export const overwriteFiles = async (dir: string) => {
  const spinner = ora("Emptying directory").start();
  try {
    fs.emptyDir(dir);
    spinner.succeed("Emptied directory");
  } catch (e) {
    spinner.fail(`Couldn't empty directory: ${formatError(e)}`);
  }
};
/**
 * Based on filetype, this function will either copy, delete, write or append (to) a file.
 */
const execFile = async (file: FileType, ctx: Context) => {
  if (file.type && file.type !== "copy") {
    if (file.type === "exec") {
      if (!file.path) {
        return;
      }
      const method = await import(file.path);
      await fs.outputFile(file.to, method.default(ctx, file.pass));
    } else if (file.type === "delete") {
      await fs.remove(file.to);
    } else if (file.type === "write") {
      await fs.outputFile(file.to, file.content!);
    } else if (file.type === "append") {
      await fs.appendFile(file.to, file.content!);
    }
  } else {
    if (!file.path) {
      return;
    }
    await fs.copy(file.path, file.to);
  }
};

export const execFiles = async (
  files: (FileType | undefined)[],
  ctx: Context
) => {
  const actualFiles = files.filter((f) => f !== undefined) as FileType[];
  for (const file of actualFiles.filter((e) => e.sep)) {
    await execFile(file, ctx);
  }
  await Promise.all(
    actualFiles
      .filter((e) => !e.sep)
      .map(async (file) => await execFile(file, ctx))
  );
};

export const renameGitIgnore = async (dir: string) => {
  await Promise.all([
    fs.rename(path.join(dir, "__gitignore"), path.join(dir, ".gitignore")),
  ]);
};
/**
 * Copying Base template
 */
export const copyDir = async (from: string, to: string) => {
  await fs.copy(path.join(from, "base"), path.join(to));
};

export const getBaseTemplateDir = () =>
  path.join(__dirname, "../../", "template");

export const getInstallersDir = async () =>
  await fs.readdir(path.join(__dirname, "../installers"));

export const updateJson = async (
  dir: string,
  file: `${string}.json`,
  cb: (json: unknown) => Promise<unknown>
) => {
  const json = await fs.readJSON(path.join(dir, file));
  const updatedJson = await cb({ ...json });
  await fs.writeFile(
    path.join(dir, file),
    JSON.stringify(updatedJson, null, 2)
  );
  return updatedJson;
};
