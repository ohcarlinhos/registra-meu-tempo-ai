export const useAuthStore = defineStore("AuthStore", {
  state: () => {
    return {
      _userToken: "",
    };
  },
  actions: {
    setUserToken(token: string) {
      this._userToken = token;
    },
    clearUserToken() {
      this._userToken = "";
    },
  },
  getters: {
    getUserToken: (state) => state._userToken,

    isAuthenticad: (state) => {
      return state._userToken != "";
    },
  },
  persist: true,
});

