import { defineStore } from "pinia";

export const useMockStoreV2 = defineStore("mock-store", () => {
  const { public: p } = useRuntimeConfig();

  const rfMock = computed(() => {
    return {
      name: p.rfmName,
      email: p.rfmEmail,
      registerCode: p.rfmCode,
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
