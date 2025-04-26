export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  if (loggedIn.value) return navigateTo({ name: "record.panel" });

  watch(
    () => loggedIn.value,
    (newValue) => {
      if (newValue) {
        return navigateTo({ name: "record.panel" });
      }
    }
  );
});
