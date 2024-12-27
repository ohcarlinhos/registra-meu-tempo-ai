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

  return {
    baseURL,
    hasWarTools,
    oldUserToken,
  };
});
