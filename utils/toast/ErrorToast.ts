import { useToast as useToastX } from "@/components/ui/toast/use-toast";

export const ErrorToast = (error: unknown) => {
  return useToastX().toast(MessageErrorHandle(error));
};
