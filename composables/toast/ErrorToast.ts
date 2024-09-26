export const ErrorToast = (error: unknown) => {
  return useToast().add(MessageErrorHandle(error));
};
