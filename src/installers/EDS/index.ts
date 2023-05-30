import { withPackages } from "~packages";
import type { Installer } from "~types";

const config: Installer = () => ({
  pkgs: withPackages({
    normal: [
      "@equinor/eds-icons",
      "@equinor/eds-core-react",
      "styled-components",
      "react-is",
    ],
    dev: ["@types/styled-components"],
  }),
});

export default config;
