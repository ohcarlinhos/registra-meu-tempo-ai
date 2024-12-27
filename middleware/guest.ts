export default defineNuxtRouteMiddleware((to) => {
  const { userToken } = storeToRefs(useAuthStore());
  if (userToken.value) return navigateTo({ name: "record.panel" });
});
