import type { Context } from "~types";
import inquirer from "inquirer";
import path from "path";
import chalk from "chalk";
import {
  getProjectNameFromSuppliedArg,
  shouldOverwriteDirPrompt,
} from "~utils/cmd";
import { validateName } from "~utils/validators";
import { existsOrCreate, overwriteFiles } from "~utils/fs";

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
  let pName = getProjectNameFromSuppliedArg(args);
  if (pName && !validateName(pName)) {
    pName = undefined;
  }

  const appName =
    pName ||
    (
      await inquirer.prompt<{ appName: string }>({
        name: "appName",
        type: "input",
        message: "What is the name of your app?",
        validate: validateName,
        default: "my-fusion-app",
      })
    ).appName;

  const cwd = args.includes("current");
  const dir = path.resolve(process.cwd(), cwd ? "" : appName);
  const dirExists = await existsOrCreate(dir);

  if (dirExists && !cwd) {
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
    templateDir: path.join(__dirname, "../../template"),
  };
};
