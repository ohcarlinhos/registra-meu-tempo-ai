export const OkToast = (title: string) => {
  return useToast().add({ title, color: "green" });
};
