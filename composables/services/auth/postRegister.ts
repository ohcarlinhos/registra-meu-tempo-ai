export const postRegister = async (
    name: string,
    email: string,
    password: string
) => {
    const { error } = await useFetch("/users", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "post",
        body: {
            Name: name,
            Email: email,
            Password: password,
        },
    });

    if (error.value) throw error.value?.data.message;
};
