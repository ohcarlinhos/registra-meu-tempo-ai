import type colors from "#ui-colors";

interface SimpleToast {
  title: string;
  description?: string;
  color?: (typeof colors)[number];
}

export const SimpleErrorToast = (payload: SimpleToast) => {
  return useToast().add(payload);
};
