const packages = {
  dev: {
    //EDS/Styled components
    "@types/styled-components": "^5.1.26",
  },
  normal: {
    // navigation
    "@equinor/fusion-framework-module-navigation": "^2.1.2",
    "@remix-run/router": "^1.6.2",
    "react-router-dom": "^6.4.3",
    // Context
    "@equinor/fusion-framework-module-context": "^4.0.8",
    //React query
    "@tanstack/react-query": "^4.29.12",
    // Ag grid
    "@equinor/fusion-framework-module-ag-grid": "^29.3.1",
    "@equinor/workspace-ag-grid": "^1.0.0",
    // EDS
    "@equinor/eds-core-react": "^0.30.0",
    "@equinor/eds-icons": "^0.19.1",
    "styled-components": "^5.3.9",
    "react-is": "^18.2.0",
  },
};
export type Pkgs = typeof packages;
export type KeyOrKeyArray<K extends keyof Pkgs> =
  | keyof Pkgs[K]
  | (keyof Pkgs[K])[];

export const withPackages = (optIn: {
  [K in keyof Pkgs]?: KeyOrKeyArray<K>;
}) => {
  const normals: { [K in keyof Pkgs["normal"]]?: string } = {};
  const devs: { [K in keyof Pkgs["dev"]]?: string } = {};
  for (const keyType in optIn) {
    type OptIn = keyof typeof optIn;
    const __curr = optIn[keyType as OptIn];
    const arrOptIn = Array.isArray(__curr) ? __curr : [__curr];

    for (const curr of arrOptIn) {
      const name = curr?.includes("->") ? curr.split("->")[0] : curr;

      if (keyType === "dev") {
        devs[name as keyof typeof devs] =
          packages.dev[curr as keyof typeof packages.dev];
      } else {
        normals[name as keyof typeof normals] =
          packages.normal[curr as keyof typeof packages.normal];
      }
    }
  }
  return [normals, devs];
};

export type ExpectedPackages = ReturnType<typeof withPackages>;
