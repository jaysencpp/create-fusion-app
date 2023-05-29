import inquirer from "inquirer";
import type { Installers } from "~types";
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
    .find((o) => o.startsWith("pname="))
    ?.split("pname=")
    .pop();
};

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
      message: "What whould we use for this app?",
      choices: choices,
    })
  ).pkgs;
//#endregion
