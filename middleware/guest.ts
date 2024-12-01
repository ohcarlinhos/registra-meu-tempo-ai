export default defineNuxtRouteMiddleware((to) => {
  const { userToken } = storeToRefs(useAuthStoreV2());
  if (userToken.value) return navigateTo({ name: "record.panel" });
});
