import {
  useToast as useToastX,
  type Toast,
} from "@/components/ui/toast/use-toast";

export const SimpleToast = (payload: Toast) => {
  return useToastX().toast(payload);
};
