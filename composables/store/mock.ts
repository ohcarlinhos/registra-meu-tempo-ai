import { defineStore } from "pinia";

export const useMockStore = defineStore("mock-store", () => {
  const { public: p } = useRuntimeConfig();

  const rfMock = computed(() => {
    return {
      name: p.rfmName,
      email: p.rfmEmail,
      password: p.rfmPassword,
      confirmPassword: p.rfmPassword,
    };
  });

  const rfMockEnable = computed(() => {
    return p.rfmEnable === "1";
  });

  return {
    rfMock,
    rfMockEnable,
  };
});
