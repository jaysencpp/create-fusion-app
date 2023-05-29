import type { Context, InstallerContext } from "~types";
import path from "path";
import chalk from "chalk";
import {
  execa,
  getProjectNameFromSuppliedArg,
  getProjectNamePrompt,
  isCwdFromSuppliedArg,
  shouldOverwriteDirPrompt,
} from "~utils/cmd";
import { isPkgJson, validateName } from "~utils/validators";
import {
  copyDir,
  existsOrCreate,
  getBaseTemplateDir,
  overwriteFiles,
  renameGitIgnore,
  updateJson,
} from "~utils/fs";
import ora from "ora";
import { formatError } from "~utils/errors";
import type { ExpectedPackages } from "~packages";
import { findAndCopyTemplates } from "~utils/templateHelpers";

const getPkgManager = () => {
  const agent = process.env.npm_config_user_agent;
  return agent?.startsWith("yarn")
    ? "yarn"
    : agent?.startsWith("pnpm")
    ? "pnpm"
    : "npm";
};

export const init = async (args: string[]): Promise<Context> => {
  console.log();
  let projectName = getProjectNameFromSuppliedArg(args);
  if (projectName && !validateName(projectName)) {
    projectName = undefined;
  }

  const appName = projectName || (await getProjectNamePrompt());

  const isCwd = isCwdFromSuppliedArg(args);
  const dir = path.resolve(process.cwd(), isCwd ? "" : appName);
  const dirExists = await existsOrCreate(dir);

  if (dirExists && !isCwd) {
    if (await shouldOverwriteDirPrompt()) {
      await overwriteFiles(dir);
    } else {
      console.log(chalk.red("Aborting..."));
      process.exit(1);
    }
  }

  const pkgManager = getPkgManager();

  return {
    appName,
    userDir: dir,
    pkgManager,
    templateDir: path.join(__dirname, "../template"),
  };
};

export const copyTemplate = async (context: Context) => {
  console.log();
  const spinner = ora("Copying template files").start();
  const templateDir = getBaseTemplateDir();
  try {
    await copyDir(templateDir, context.userDir);
    await renameGitIgnore(context.userDir);
    spinner.succeed(`Copied template files to ${context.userDir}`);
  } catch (e) {
    spinner.fail(`Couldn't copy template files: ${formatError(e)}`);
    process.exit(1);
  }
};

const updatePackageJson = async (
  ctx: InstallerContext,
  scripts: Record<string, string>,
  pkgs: ExpectedPackages
) => {
  const [normalDeps, devModeDeps] = pkgs;
  await updateJson(ctx.userDir, "package.json", async (json) => {
    if (isPkgJson(json)) {
      json.name = ctx.appName;
      json.scripts = { ...json.scripts, ...scripts };
      json.dependencies = { ...json.dependencies, ...normalDeps };
      json.devDependencies = { ...json.devDependencies, ...devModeDeps };
      return json;
    }
    return json;
  });
};

export const modifyProject = async (
  ctx: InstallerContext,
  deps: ExpectedPackages,
  scripts: Record<string, string>
) => {
  const spinner = ora("Modifying project").start();
  try {
    await Promise.all([
      findAndCopyTemplates(ctx),
      updatePackageJson(ctx, scripts, deps),
    ]);
    spinner.succeed("Modified project");
  } catch (e) {
    spinner.fail(`Couldn't modify project: ${formatError(e)}`);
    process.exit(1);
  }
};
export const installDeps = async (ctx: InstallerContext) => {
  console.log(`Using ${ctx.pkgManager.toUpperCase()} as package manager`);
  const spinner = ora("Installing dependencies").start();
  try {
    const flags = ctx.pkgManager === "npm" ? " --legacy-peer-deps" : "";
    await execa(`${ctx.pkgManager} install${flags}`, { cwd: ctx.userDir });
    spinner.succeed("Installed dependencies");
  } catch (e) {
    spinner.fail(`Couldn't install dependencies: ${formatError(e)}`);
    process.exit(1);
  }
};
export const runCommands = async (ctx: Context, commands: string[]) => {
  const spinner = ora("Running queued commands").start();
  try {
    for (const cmd of commands) {
      await execa(cmd, {
        cwd: ctx.userDir,
      });
      spinner.succeed("Ran queued commands");
    }
  } catch (e) {
    spinner.fail(`Couldn't run queued commands: ${formatError(e)}`);
    process.exit(1);
  }
};
export const finish = (ctx: InstallerContext) => {
  console.log(chalk.green(`cd ${ctx.appName}`));
  const withRun = ctx.pkgManager === "pnpm" ? "" : " run";
  console.log(chalk.bold(chalk.blue(`\t${ctx.pkgManager}${withRun} dev`)));
  console.log();
  process.exit(0);
};
