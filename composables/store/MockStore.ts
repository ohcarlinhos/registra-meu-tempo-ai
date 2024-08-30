export const useMockStore = defineStore("MockStore", {
  getters: {
    registerFormEnable() {
      const env = useRuntimeConfig().public;
      return env.registerFormMockEnable === "1";
    },
    registerForm() {
      const env = useRuntimeConfig().public;

      return {
        name: env.registerFormMockName,
        email: env.registerFormMockEmail,
        registerCode: env.registerFormMockCode,
        password: env.registerFormMockPassword,
        confirmPassword: env.registerFormMockPassword,
      };
    },
  },
});
