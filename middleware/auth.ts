export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo({ name: "login" });
  }

  const mySelfStore = useMySelfStore();
  const { fetchMySelf } = mySelfStore;
  const { mySelf } = storeToRefs(mySelfStore);

  if (!mySelf.value) {
    await fetchMySelf();
  }
});
