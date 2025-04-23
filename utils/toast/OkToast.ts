import { useToast as useToastX } from "@/components/ui/toast/use-toast";

export const OkToast = (description: string) => {
  return useToastX().toast({ description });
};
