#!/usr/bin/env node

import {
  copyTemplate,
  finish,
  init,
  installDeps,
  modifyProject,
  runCommands,
} from "~utils";
import { getSuppliedArgs } from "~utils/cmd";
import { getCtxWithInstallers, runInstallers } from "~utils/installers";

async function main() {
  const args = getSuppliedArgs();
  const context = await init(args);
  await copyTemplate(context);
  const ctxWithInstallers = await getCtxWithInstallers(context, args);
  const [scripts, deps, commands] = await runInstallers(ctxWithInstallers);
  await modifyProject(ctxWithInstallers, deps, scripts);
  await installDeps(ctxWithInstallers);
  await runCommands(context, commands);
  finish(ctxWithInstallers);
}

main().catch(() => {
  console.log("Something wernt wrong");
  process.exit(1);
});
