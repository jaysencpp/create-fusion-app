import type { AppModuleInitiator } from "@equinor/fusion-framework-app";
import { enableAgGrid } from "@equinor/fusion-framework-module-ag-grid";
import { enableContext } from "@equinor/fusion-framework-react-module-context";
import { enableNavigation } from "@equinor/fusion-framework-module-navigation";
import buildQuery from "odata-query";

export const configure: AppModuleInitiator = (configurator, args) => {
  const { basename } = args.env;
  enableNavigation(configurator, basename);
  enableContext(configurator, async (builder) => {
    builder.setContextType(["orgchart"]); // set contextType to match against
    builder.setContextParameterFn(({ search, type }) => {
      return buildQuery({
        search,
        filter: {
          type: {
            in: type,
          },
        },
      });
    });
  });
  enableAgGrid(configurator);
};

export default configure;
