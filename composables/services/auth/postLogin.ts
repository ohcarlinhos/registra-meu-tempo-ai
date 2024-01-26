export const postLogin = async (email: string, password: string) => {
    const { data, error } = await useFetch("/auth/login", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "post",
        body: {
            Email: email,
            Password: password,
        },
    });

    if (error.value) throw error.value?.data.message;

    const { Token } = data.value as { Token: string };
    return Token;
};
