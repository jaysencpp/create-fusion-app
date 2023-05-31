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
const getSuppliedArg = (
  args: string[],
  argToLookFor: keyof typeof SUPPLIED_ARGS
) =>
  args
    .find((o) => o.startsWith(`${argToLookFor}=`))
    ?.split(`${argToLookFor}=`)
    .pop();

export const getProjectNameFromSuppliedArg = (args: string[]) =>
  getSuppliedArg(args, SUPPLIED_ARGS.pname);
export const getAppNameFromSuppliedArg = (args: string[]) =>
  getSuppliedArg(args, SUPPLIED_ARGS.appname);
export const getAppKeyFromSuppliedArg = (args: string[]) =>
  getSuppliedArg(args, SUPPLIED_ARGS.key);
export const getAppShortNameFromSuppliedArg = (args: string[]) =>
  getSuppliedArg(args, SUPPLIED_ARGS.shortname);

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
      message: "What is the name of your project?",
      validate: validateName,
      default: "my-fusion-app",
    })
  ).appName;

export const getManifestAppNamePrompt = async () =>
  (
    await inquirer.prompt<{ manifestAppName: string }>({
      name: "manifestAppName",
      type: "input",
      message: "(Manifest) - What is the display name for the app?",
      validate: validateName,
    })
  ).manifestAppName;

export const getManifestAppShortNamePrompt = async () =>
  (
    await inquirer.prompt<{ manifestAppShortName: string }>({
      name: "manifestAppShortName",
      type: "input",
      message: "(Manifest) - What is the shortname for the app?",
      validate: validateName,
    })
  ).manifestAppShortName;

export const getManifestAppKeyPrompt = async () =>
  (
    await inquirer.prompt<{ manifestAppKey: string }>({
      name: "manifestAppKey",
      type: "input",
      message: "(Manifest) - What is the key for the app?",
      validate: validateName,
    })
  ).manifestAppKey;
//#endregion
