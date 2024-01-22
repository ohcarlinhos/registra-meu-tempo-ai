<script lang="ts" setup>
const form = reactive({
    email: "",
    password: "",
});
</script>

<template>
    <UContainer
        :ui="{
            base: 'flex flex flex-row items-center',
            background: 'bg-neutral-900',
            constrained: 'min-h-svh max-w-sm',
        }"
    >
        <UCard
            :ui="{
                base: 'grow',
                footer: {
                    base: 'text-center',
                },
            }"
        >
            <template #header> Acessar Painel </template>

            <UForm :state="form" class="space-y-4">
                <UFormGroup label="Email" name="email">
                    <UInput type="email" v-model="form.email" />
                </UFormGroup>

                <UFormGroup label="Senha" name="password">
                    <UInput type="password" v-model="form.password" />
                </UFormGroup>

                <UButton block label="Entrar" />
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
    </UContainer>
</template>
