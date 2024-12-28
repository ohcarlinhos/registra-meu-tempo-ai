export const logout = () => {
  const router = useRouter();

  const authStore = useAuthStore();
  const { clearSession } = authStore;

  clearSession();
  router.push({ name: "login" });
};
