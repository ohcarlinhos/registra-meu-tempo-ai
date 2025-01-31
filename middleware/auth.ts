export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuth } = storeToRefs(useAuthStore());

  console.log("tá auth", isAuth.value);

  // if (import.meta.server) {
  //   return;
  // }

  if (!isAuth.value) {
    return navigateTo({ name: "home" });
  }

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
