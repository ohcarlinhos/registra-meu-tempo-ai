type Payload = {
    nome: string;
    email: string;
    senha: string;
};

export const postRegister = async (payload: Payload) => {
    const { error } = await useFetch("usuario", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "post",
        body: payload,
    });

    if (error.value) throw error.value?.data.message;
};
