export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  if (loggedIn.value) return navigateTo({ name: "dashboard" });

  watch(
    () => loggedIn.value,
    (newValue) => {
      if (newValue) {
        return navigateTo({ name: "dashboard" });
      }
    }
  );
});
