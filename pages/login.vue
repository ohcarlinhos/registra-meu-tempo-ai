<script lang="ts" setup>
import * as yup from "yup";

definePageMeta({ middleware: ["guest"] });

const form = reactive({
    email: "carlinhos@teste.com",
    password: "123456",
});

const pageStatus = reactive({ fetching: false });

const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(32).required(),
});

const submit = async () => {
    try {
        pageStatus.fetching = true;

        const token: string = await postLogin(form.email, form.password);
        useAuthStore().setUserToken(token);
        useRouter().push("/dashboard");
    } catch (error) {
        useToast().add({ title: error as string, color: "red" });
    } finally {
        pageStatus.fetching = false;
    }
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
