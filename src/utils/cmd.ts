import inquirer from "inquirer";
import type { Installers } from "~types";
import { validateName } from "./validators";
import { SUPPLIED_ARGS } from "./constants";
import { exec } from "child_process";
import { promisify } from "util";

export const execa = promisify(exec);
/**
 * Gets the supplied arguments from the user
 * @example `npm create fusion-app --example` -> --example is a supplied arg
 */
export const getSuppliedArgs = () => {
  return process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => arg.slice(2).toLowerCase());
};

export const getProjectNameFromSuppliedArg = (args: string[]) => {
  return args
    .find((o) => o.startsWith(`${SUPPLIED_ARGS.pname}=`))
    ?.split(`${SUPPLIED_ARGS.pname}=`)
    .pop();
};

export const isCwdFromSuppliedArg = (args: string[]) =>
  args.includes(SUPPLIED_ARGS.current);

export const isSkipFromSuppliedArg = (args: string[]) =>
  args.includes(SUPPLIED_ARGS.skip);

//#region prompts
export const shouldOverwriteDirPrompt = async () => {
  return (
    await inquirer.prompt<{ overWrite: boolean }>({
      name: "overWrite",
      type: "confirm",
      message: "Do you want to overwrite this directory?",
    })
  ).overWrite;
};

export const getInstallersPrompt = async (choices: string[]) =>
  (
    await inquirer.prompt<{ pkgs: Installers[] }>({
      name: "pkgs",
      type: "checkbox",
      message: "What do you want to include in this app?",
      choices: choices,
    })
  ).pkgs;

export const getProjectNamePrompt = async () =>
  (
    await inquirer.prompt<{ appName: string }>({
      name: "appName",
      type: "input",
      message: "What is the name of your app?",
      validate: validateName,
      default: "my-fusion-app",
    })
  ).appName;
//#endregion
