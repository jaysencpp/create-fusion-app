import type { AppModuleInitiator } from "@equinor/fusion-framework-app";
import { enableAgGrid } from "@equinor/fusion-framework-module-ag-grid";
import { enableNavigation } from "@equinor/fusion-framework-module-navigation";

export const configure: AppModuleInitiator = (configurator, args) => {
  const { basename } = args.env;
  enableNavigation(configurator, basename);
  enableAgGrid(configurator);
};

export default configure;
