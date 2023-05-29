import type { Config, Context, Env, Installers } from "~types";
import chalk from "chalk";
import { getInstallersPrompt } from "./cmd";
import { execFiles, getInstallersDir } from "./fs";
import type { ExpectedPackages } from "~packages";

export const getCtxWithInstallers = async (ctx: Context, curr: string[]) => {
  let installers: string[] = [];
  let pkgs: Installers[] = [];
  const skip = curr.includes("skip");
  try {
    installers = await getInstallersDir();
  } catch {
    // Do nothing
  }

  if (installers.length) {
    const validInstallers = curr.length
      ? installers.filter((i) => curr.some((c) => c === i.toLowerCase()))
      : [];
    if (validInstallers.length) {
      console.log(
        `${chalk.green("OK")} Using installers: ${validInstallers
          .map((installer) => chalk.blue(installer))
          .join(", ")}`
      );
    }
    if (!skip) {
      const optInstallers = installers.filter(
        (pkg) => !validInstallers.includes(pkg)
      );

      const newPkgs = await getInstallersPrompt(optInstallers);
      pkgs = [...validInstallers, ...newPkgs] as Installers[];
    } else {
      pkgs = validInstallers as Installers[];
    }
  }
  return {
    ...ctx,
    installers: pkgs,
  };
};

export const runInstallers = (ctx: Context) => {
  let normalDeps: ExpectedPackages[0] = {};
  let devModeDeps: ExpectedPackages[1] = {};
  let scripts: Record<string, string> = {};
  let env: Env[] = [
    {
      key: "MODE",
      type: "enum(['development', 'production', 'test')].default('development')",
      ignore: true,
    },
  ];
  let commands: string[] = [];
  const execInstallers = async (cfg: Config) => {
    if (cfg.pkgs) {
      normalDeps = { ...normalDeps, ...cfg.pkgs[0] };
      devModeDeps = { ...devModeDeps, ...cfg.pkgs[1] };
    }
    if (cfg.scripts) {
      scripts = { ...scripts, ...cfg.scripts };
    }
    if (cfg.files?.length) {
      await execFiles(cfg.files, ctx);
    }
    if (cfg.commands) {
      if (Array.isArray(cfg.commands)) {
        commands = [...cfg.commands, ...commands];
      } else {
        commands.unshift(cfg.commands);
      }
    }
    if (cfg.env?.length) {
      env = [...env, ...cfg.env];
    }
  };
  // const resp = await Promise.all(ctx.)
};
