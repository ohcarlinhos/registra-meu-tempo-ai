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
        getUserToken(state) {
            return state.userToken;
        },
    },
    persist: true,
});
