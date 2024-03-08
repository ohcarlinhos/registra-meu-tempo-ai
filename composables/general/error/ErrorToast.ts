export const ErrorToast = (error: unknown) => {
  return useToast().add(ErrorHandleMessage(error));
};
