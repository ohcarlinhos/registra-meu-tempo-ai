export default defineNuxtRouteMiddleware((to) => {
  if (useAuthStore().getUserToken) return navigateTo({ name: "record.panel" });
});
