import type { ButtonVariants } from "~/components/ui/button";

export const isVariant = (
  condition: boolean,
  variant: ButtonVariants["variant"],
  variant2: ButtonVariants["variant"]
) => {
  return condition ? variant : variant2;
};
