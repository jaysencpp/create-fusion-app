import type { AppModuleInitiator } from "@equinor/fusion-framework-app";
import { enableAgGrid } from "@equinor/fusion-framework-module-ag-grid";

export const configure: AppModuleInitiator = (configurator, args) => {
  enableAgGrid(configurator);
};

export default configure;
