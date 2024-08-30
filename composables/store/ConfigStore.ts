export const useConfigStore = defineStore("ConfigStore", {
  getters: {
    hasWarTools() {
      return useRuntimeConfig().public.enableWarTools === "1";
    },

    apiBase() {
      return useRuntimeConfig().public.apiBase || "";
    },

    oldUserToken() {
      return useRuntimeConfig().public.oldUserToken || "";
    },
  },
});
