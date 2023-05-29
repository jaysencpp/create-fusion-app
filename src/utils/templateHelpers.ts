import { FileType, InstallerContext, UtilFunc } from "~types";
import { execFiles } from "./fs";

const appHelper = (
  usingRq: boolean,
  usingNav: boolean,
  ctx: InstallerContext
) => {
  let appFileName = "";
  if (usingNav && usingRq) {
    appFileName = `with-nav-rq.tsx`;
  } else if (usingRq) {
    appFileName = `with-rq.tsx`;
  } else if (usingNav) {
    appFileName = `with-nav.tsx`;
  }

  return appFileName ? `${ctx.templateDir}/app/${appFileName}` : "";
};

const configHelper = (
  usingNav: boolean,
  usingCtx: boolean,
  ctx: InstallerContext
) => {
  let appFileName = "";
  if (usingNav && usingCtx) {
    appFileName = `with-nav-ctx.ts`;
  } else if (usingCtx) {
    appFileName = `with-ctx.ts`;
  } else if (usingNav) {
    appFileName = `with-nav.ts`;
  }

  return appFileName ? `${ctx.templateDir}/config/${appFileName}` : "";
};

export const getAppChoice: UtilFunc = (ctx) => {
  const usingRq = ctx.installers.includes("React Query");
  const usingNav = ctx.installers.includes("Routing");
  return appHelper(usingRq, usingNav, ctx);
};
export const getConfigChoice: UtilFunc = (ctx) => {
  const usingNav = ctx.installers.includes("Routing");
  const usingCtx = ctx.installers.includes("Fusion Context");
  return configHelper(usingNav, usingCtx, ctx);
};

export const findAndCopyTemplates = async (ctx: InstallerContext) => {
  const app = getAppChoice(ctx);
  const config = getConfigChoice(ctx);
  console.log("GOT APP", app);
  console.log("GOT CONFIG", config);
  const files: FileType[] = [];

  if (app) {
    files.push({
      path: app,
      type: "copy",
      to: `${ctx.userDir}/src/App.tsx`,
    });
  }

  if (config) {
    files.push({
      path: config,
      type: "copy",
      to: `${ctx.userDir}/src/config.ts`,
    });
  }
  await execFiles(files, ctx);
};
