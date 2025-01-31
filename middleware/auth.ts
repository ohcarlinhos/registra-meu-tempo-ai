export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuth } = storeToRefs(useAuthStore());

  if (!isAuth.value) {
    console.log("bundinha");
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
