export const isVerifiedPage = (name: string) => {
  return ["verify.page.code", "verify.page"].includes(name);
};

export const logout = () => {
  const router = useRouter();

  const authStore = useAuthStoreV2();
  const { clearSession } = authStore;

  clearSession();
  router.push("/login");
};
