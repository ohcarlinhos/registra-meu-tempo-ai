<script lang="ts" setup></script>

<template>
    <header class="pb-20">
        <section>
            <h1 class="font-bold text-6xl text-teal-500">Pomodoro v2</h1>
            <p class="pt-4">
                Versão 2 do
                <span class="font-bold text-teal-500">Pomodoro</span> com
                integração "total" com API.
            </p>
        </section>
        <nav class="pt-6 flex gap-4">
            <ULink to="/" active-class="text-teal-500">Página Inicial</ULink>
            <ULink to="/dashboard" active-class="text-teal-500">Painel</ULink>
            <ULink to="/login" active-class="text-teal-500">Acesso</ULink>
            <ULink to="/register" active-class="text-teal-500">
                Registrar
            </ULink>
        </nav>
    </header>
</template>
