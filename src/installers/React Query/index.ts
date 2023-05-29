import { withPackages } from "~packages";
import type { Installer } from "~types";

const config: Installer = () => ({
  pkgs: withPackages({
    normal: ["@tanstack/react-query"],
  }),
});

export default config;
