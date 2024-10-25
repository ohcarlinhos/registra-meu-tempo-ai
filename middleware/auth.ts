export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const router = useRouter();

  if (!authStore.getUserToken) return navigateTo("/");

  // if (authStore.claim.isVerified == false) {
  //   return router.push({ name: "verify.page" });
  // }
});
