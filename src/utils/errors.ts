export const DEFAULT_ERROR = "Something went wrong";
export const errorCheck = (message?: string) => {
  return message?.length ? message : DEFAULT_ERROR;
};
export const formatError = (error: unknown): string => {
  if (typeof error === "string") return errorCheck(error);
  else if (typeof error === "object") {
    if (Array.isArray(error)) {
      if (error.length) {
        return formatError(error.shift());
      } else return errorCheck();
    } else if (error && "message" in error) {
      return formatError(error.message);
    } else if (error && "stack" in error) {
      return formatError(error.stack);
    }
  }
  return errorCheck();
};
