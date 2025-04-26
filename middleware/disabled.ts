export default defineNuxtRouteMiddleware(() => {
  return navigateTo({ name: "login" });
});
