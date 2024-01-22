<script lang="ts" setup>
const form = reactive({
    email: "",
    name: "",
    password: "",
    confirm_password: "",
});
</script>

<template>
    <UContainer
        :ui="{
            base: 'flex flex flex-row items-center',
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
            <template #header> Registrar </template>

            <UForm :state="form" class="space-y-4">
                <UFormGroup label="Nome" name="name">
                    <UInput type="text" v-model="form.email" />
                </UFormGroup>

                <UFormGroup label="Email" name="email">
                    <UInput type="email" v-model="form.email" />
                </UFormGroup>

                <UFormGroup label="Senha" name="password">
                    <UInput type="password" v-model="form.password" />
                </UFormGroup>

                <UFormGroup label="Repita a Senha" name="confirm_password">
                    <UInput type="password" v-model="form.confirm_password" />
                </UFormGroup>

                <UButton block label="Registar" />
            </UForm>

            <template #footer>
                <ULink
                    to="/login"
                    inactive-class="text-primary font-bold text-xs"
                >
                    Clique aqui para acessar o Painel!
                </ULink>
            </template>
        </UCard>
    </UContainer>
</template>
