type Payload = {
    email: string;
    senha: string;
};

export const postLogin = async (payload: Payload) => {
    const { data, error } = await useFetch("auth/login", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "post",
        body: payload,
    });

    if (error.value) throw error.value?.data.message;

    const { token } = data.value as { token: string };
    return token;
};
