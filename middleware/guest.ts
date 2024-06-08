export default defineNuxtRouteMiddleware((to) => {
  if (useAuthStore().getUserToken) return navigateTo("/time-record");
});
