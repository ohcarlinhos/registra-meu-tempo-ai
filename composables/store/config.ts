export const useConfigStore = defineStore("config-store", () => {
  const runtimeConfig = useRuntimeConfig();

  const hasWarTools = computed(() => {
    return runtimeConfig.public.enableWarTools === "1";
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

  const breadcrumbPage = ref<{ label: string; pageName?: string }[]>([]);

  const setBreadcrumbPage = (
    values: { label: string; pageName?: string }[]
  ) => {
    breadcrumbPage.value = values;
  };

  return {
    breadcrumbPage,
    setBreadcrumbPage,
    hasWarTools,
    oldUserToken,
    onlyGuestMode,
    enableUserChallenge,
  };
});
