import type colors from "#ui-colors";

interface SimpleToastPayload {
  title: string;
  description?: string;
  color?: (typeof colors)[number];
}

export const SimpleToast = (payload: SimpleToastPayload) => {
  return useToast().add(payload);
};
