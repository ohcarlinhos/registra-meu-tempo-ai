export const useAuthStore = defineStore("AuthStore", {
  state: () => {
    return {
      userToken: "",
    };
  },
  actions: {
    setUserToken(token: string) {
      this.userToken = token;
    },
    clearUserToken() {
      this.userToken = "";
    },
  },
  getters: {
    getUserToken: (state) => state.userToken,
  },
  persist: true,
});
