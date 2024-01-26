<script lang="ts" setup>
const { getUserToken, clearUserToken } = useAuthStore();
const userToken = getUserToken;

const exit = () => {
    clearUserToken();
    useRouter().push("login");
};

const activeClass = "text-primary font-bold";
</script>

<template>
    <header class="pb-20">
        <section>
            <h1 class="font-bold text-6xl text-primary">Pomodoro v2</h1>
            <p class="pt-4">
                Versão 2 do
                <span class="font-bold text-primary">Pomodoro</span> com
                integração "total" com API.
            </p>
        </section>
        <nav class="pt-6 flex gap-4">
            <ULink to="/" :active-class="activeClass">Página Inicial</ULink>

            <ULink v-if="userToken" to="/dashboard" :active-class="activeClass">
                Painel
            </ULink>

            <ULink v-if="!userToken" to="/login" :active-class="activeClass">
                Acesso
            </ULink>

            <ULink v-if="!userToken" to="/register" :active-class="activeClass">
                Registrar
            </ULink>

            <UButton
                v-if="userToken"
                variant="link"
                :padded="false"
                size="xl"
                label="Sair"
                @click="exit"
            />
        </nav>
    </header>
</template>
