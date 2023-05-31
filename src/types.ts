import type { ExpectedPackages } from "~packages";

export type PkgManager = "npm" | "pnpm" | "yarn";
export type AppManifest = {
  name: string;
  shortName: string;
  key: string;
  version: {
    major: string;
    minor: string;
    patch: string;
  };
};
export type Context = {
  userDir: string;
  projectName: string;
  templateDir: string;
  pkgManager: PkgManager;
  appManifest: {
    name: string;
    shortName: string;
    key: string;
  };
};

export type Installers =
  | "Fusion Context"
  | "Routing"
  | "React Query"
  | "Ag Grid"
  | "EDS";

export type InstallerContext = Context & {
  installers: Installers[];
};
export type Env = {
  type: string;
  key: string;
  defaultValue?: string;
  ignore?: boolean;
};
export type FileType = {
  to: string;
  content?: string;
  type?: "copy" | "exec" | "delete" | "write" | "append";
  path?: string;
  sep?: boolean;
  pass?: any;
};
export type Config = {
  files?: Array<FileType | undefined>;
  pkgs?: ExpectedPackages;
  scripts?: Record<string, string>;
  env?: Env[];
  commands?: string | string[];
};

export type InstallerCB = (ctx: Context) => Promise<Config> | Config;
export type Installer = Config | InstallerCB;
export type UtilFunc<T = undefined> = (
  ctx: InstallerContext,
  passed?: T
) => string;
