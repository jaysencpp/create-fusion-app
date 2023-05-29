import { withPackages } from "~packages";
import type { Installer } from "~types";

const config: Installer = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/Router.txt`,
      to: `${ctx.userDir}/src/Router.tsx`,
    },
    {
      path: `${__dirname}/files/routes.txt`,
      to: `${ctx.userDir}/src/routes.tsx`,
    },
  ],
  pkgs: withPackages({
    normal: [
      "@equinor/fusion-framework-module-navigation",
      "@remix-run/router",
      "react-router-dom",
    ],
  }),
});

export default config;
