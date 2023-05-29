import type {
  Config,
  Context,
  Installer,
  InstallerContext,
  Installers,
} from "~types";
import chalk from "chalk";
import { getInstallersPrompt, isSkipFromSuppliedArg } from "./cmd";
import { execFiles, getInstallersDir } from "./fs";
import type { ExpectedPackages } from "~packages";
import ora from "ora";
import { formatError } from "./errors";

export const getCtxWithInstallers = async (
  ctx: Context,
  suppliedArgs: string[]
) => {
  let installers: string[] = [];
  let pkgs: Installers[] = [];
  const isSkip = isSkipFromSuppliedArg(suppliedArgs);
  try {
    installers = await getInstallersDir();
  } catch {
    // Do nothing
  }

  if (installers.length) {
    const validInstallers = suppliedArgs.length
      ? installers.filter((i) =>
          suppliedArgs.some((c) => c === i.toLowerCase())
        )
      : [];
    if (validInstallers.length) {
      console.log(
        `${chalk.green("OK")} Using installers: ${validInstallers
          .map((installer) => chalk.blue(installer))
          .join(", ")}`
      );
    }
    if (!isSkip) {
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
type ReturnT = [
  Record<string, string>,
  [ExpectedPackages[0], ExpectedPackages[1]],
  string[]
];
export const runInstallers = async (
  ctx: InstallerContext
): Promise<ReturnT> => {
  let normalDeps: ExpectedPackages[0] = {};
  let devModeDeps: ExpectedPackages[1] = {};
  let scripts: Record<string, string> = {};
  let commands: string[] = [];
  //   let env: Env[] = [
  //     {
  //       key: "MODE",
  //       type: "enum(['development', 'production', 'test')].default('development')",
  //       ignore: true,
  //     },
  //   ];
  const execInstaller = async (cfg: Config) => {
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
    // if (cfg.env?.length) {
    //   env = [...env, ...cfg.env];
    // }
  };
  const resp = await Promise.all(
    ctx.installers.map((pkg) =>
      import(`../installers/${pkg}/index`).then(
        (installer: { default: Installer }) =>
          typeof installer.default === "function"
            ? installer.default(ctx)
            : installer.default
      )
    )
  );
  console.log();
  const spinner = ora("Initializing installers").start();

  if (resp.length) {
    try {
      for (const installer of resp) {
        await execInstaller(installer);
      }
      spinner.succeed(`Initialized ${resp.length} installers`);
    } catch (e) {
      spinner.fail(`Couldn't initialize installers: ${formatError(e)}`);
      process.exit(1);
    }
  } else {
    spinner.succeed("No installers to initialize");
  }
  return [scripts, [normalDeps, devModeDeps], commands];
};
