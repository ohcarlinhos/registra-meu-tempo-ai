export default defineNuxtRouteMiddleware((to) => {
  const { isAuth } = storeToRefs(useAuthStore());
  if (isAuth.value) return navigateTo({ name: "record.panel" });
});
