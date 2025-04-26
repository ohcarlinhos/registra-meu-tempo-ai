import { defineStore } from "pinia";

export const useMockStore = defineStore("mock-store", () => {
  const runtime = useRuntimeConfig();

  const rfMock = computed(() => {
    return {
      name: runtime.public.registerFormMockName,
      email: runtime.public.registerFormMockEmail,
      password: runtime.public.registerFormMockPassword,
      confirmPassword: runtime.public.registerFormMockPassword,
    };
  });

  const rfMockEnable = computed(() => {
    return runtime.public.registerFormMockEnable.toString() === "1";
  });

  return {
    rfMock,
    rfMockEnable,
  };
});
