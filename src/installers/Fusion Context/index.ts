import { withPackages } from "~packages";
import type { Installer } from "~types";

const config: Installer = () => ({
  pkgs: withPackages({
    normal: ["@equinor/fusion-framework-module-context"],
  }),
});

export default config;
