export const useConfigStore = defineStore("config-store", () => {
  const runtimeConfig = useRuntimeConfig();

  const hasWarTools = computed(() => {
    return runtimeConfig.public.enableWarTools === "1";
  });

  const baseURL = computed(() => {
    return runtimeConfig.public.baseURL || "";
  });

  const oldUserToken = computed(() => {
    return runtimeConfig.public.oldUserToken || "";
  });

  const onlyGuestMode = computed(() => {
    return runtimeConfig.public.onlyGuestMode === "1";
  });

  const enableUserChallenge = computed(() => {
    return runtimeConfig.public.enableUserChallenge;
  });

  return {
    baseURL,
    hasWarTools,
    oldUserToken,
    onlyGuestMode,
    enableUserChallenge,
  };
});
