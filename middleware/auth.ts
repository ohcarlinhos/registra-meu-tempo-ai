export default defineNuxtRouteMiddleware((to) => {
  const { userToken } = storeToRefs(useAuthStoreV2());
  const router = useRouter();

  if (!userToken.value) return navigateTo("/");

  // if (authStore.claim.isVerified == false) {
  //   return router.push({ name: "verify.page" });
  // }
});
