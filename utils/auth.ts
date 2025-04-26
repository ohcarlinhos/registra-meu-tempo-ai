export const logout = async () => {
  await useUserSession().clear();
  useRouter().push({ name: "login" });
};
