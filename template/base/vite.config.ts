import EnvironmentPlugin from "vite-plugin-environment";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import tsConfigPaths from "vite-tsconfig-paths";
export default {
  plugins: [
    {
      ...EnvironmentPlugin({ NODE_ENV: "development" }),
      apply: "serve",
    },
    tsConfigPaths({ root: __dirname }),
  ],
  build: {
    rollupOptions: {
      plugins: [
        injectProcessEnv({
          NODE_ENV: "production",
        }),
      ],
    },
  },
};
