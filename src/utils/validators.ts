import type { AppManifest } from "~types";

export const validateName = (name: string) => {
  if (!name.length) return false;
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
    ? true
    : "This is not a valid name";
};
type PkgJson = {
  name: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};
export const isPkgJson = (json: unknown): json is PkgJson => {
  return (
    (json as PkgJson)?.dependencies !== undefined &&
    (json as PkgJson)?.devDependencies !== undefined &&
    (json as PkgJson).name !== undefined &&
    (json as PkgJson).scripts !== undefined
  );
};

export const isAppManifest = (json: unknown): json is AppManifest => {
  return (
    (json as AppManifest)?.name !== undefined &&
    (json as AppManifest)?.key !== undefined &&
    (json as AppManifest)?.shortName !== undefined &&
    (json as AppManifest)?.version !== undefined
  );
};
