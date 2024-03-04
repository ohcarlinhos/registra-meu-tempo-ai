export default defineNuxtRouteMiddleware((to) => {
  const token = useAuthStore().getUserToken;
  if (!token) return navigateTo("/");
});
