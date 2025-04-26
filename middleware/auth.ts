export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo({ name: "login" });
  }

  const userStore = useUserStore();
  const { checkIfIsVerified } = userStore;
  const { mySelf } = storeToRefs(userStore);

  if (!mySelf.value) {
    await checkIfIsVerified();
  }
});
