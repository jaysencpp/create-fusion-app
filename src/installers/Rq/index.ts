import { withPackages } from "~packages";
import type { Installer } from "~types";

const config: Installer = (ctx) => ({
  pkgs: withPackages({}),
});
