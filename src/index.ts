#!/usr/bin/env node

// import { copyTemplate, getCtxWithInstallers, init } from "~utils";

import { init } from "~utils";
import { getSuppliedArgs } from "~utils/cmd";

async function main() {
  const args = getSuppliedArgs();
  const context = await init(args);
  // await copyTemplate(context);
  // const ctxWithInstallers = await getCtxWithInstallers(context, args);
  // const [] = await runInstallers(ctx);
}

main().catch((e) => {
  console.log("Something wernt wrong");
  process.exit(1);
});
