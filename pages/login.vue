<script lang="ts" setup>
import * as yup from "yup";

definePageMeta({ middleware: ["auth"] });

const { setUserToken } = useAuthStore();

const form = reactive({
    email: "carlinhos@test.com",
    password: "@#s1$541As15A",
});

const pageStatus = reactive({ fetching: false });

const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(32).required(),
});

const submit = async () => {
    pageStatus.fetching = true;

    const { data, error } = await useFetch("/auth/login", {
        baseURL: "http://localhost:33123/api/v1",
        method: "post",
        body: {
            Email: form.email,
            Password: form.password,
        },
    });

    if (error.value) {
        useToast().add({
            title: error.value?.data.message || "Error",
            color: "red",
        });

        pageStatus.fetching = false;
        return;
    }

    const { Token } = data.value as { Token: string };
    setUserToken(Token);

    pageStatus.fetching = false;
    useRouter().push("/dashboard");
};
</script>

<template>
    <UContainer
        :ui="{
            base: 'flex flex-col items-center justify-center gap-5',
            constrained: 'min-h-svh max-w-sm',
        }"
    >
        <UCard
            :ui="{
                base: 'w-full',
                footer: { base: 'text-center' },
            }"
        >
            <template #header> Acessar Painel </template>

            <UForm
                :schema="schema"
                :state="form"
                class="space-y-4"
                @submit="submit"
            >
                <UFormGroup label="Email" name="email">
                    <UInput type="email" v-model="form.email" />
                </UFormGroup>

                <UFormGroup label="Senha" name="password">
                    <UInput type="password" v-model="form.password" />
                </UFormGroup>

                <UButton
                    :loading="pageStatus.fetching"
                    block
                    type="submit"
                    label="Entrar"
                />
            </UForm>

            <template #footer>
                <ULink
                    to="/register"
                    inactive-class="text-primary font-bold text-xs"
                >
                    Clique aqui para registrar!
                </ULink>
            </template>
        </UCard>

        <ULink to="/dashboard" inactive-class="text-primary font-bold text-xs">
            Ir para Página Inicial
        </ULink>
    </UContainer>
</template>
