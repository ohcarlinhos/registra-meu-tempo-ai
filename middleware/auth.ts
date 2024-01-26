export default defineNuxtRouteMiddleware((to) => {
    const name = to.name?.toString() || "";
    const token = useAuthStore().getUserToken;

    if (name && ["login", "register"].includes(name)) {
        if (token) return navigateTo("/dashboard");
        return;
    }

    if (!token) return navigateTo("/");
});
