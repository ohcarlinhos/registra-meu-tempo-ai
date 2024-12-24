export default defineNuxtRouteMiddleware(async (to) => {
  const { userToken, isAuth } = storeToRefs(useAuthStoreV2());

  if (!userToken.value) return navigateTo("/");

  const userStore = useUserStore();
  const { checkIfIsVerified } = userStore;
  const { isVerified, mySelf } = storeToRefs(userStore);

  if (!mySelf.value) {
    await checkIfIsVerified();
  }

  if (
    isAuth.value &&
    !isVerified.value &&
    to.name !== "need.verify" &&
    !isVerifiedPage(to.name as string)
  ) {
    return navigateTo({ name: "need.verify" });
  }
});
