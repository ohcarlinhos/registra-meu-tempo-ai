<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "need.verify" });
useHead({ title: "Você precisa verificar sua conta!" });
const router = useRouter();

const verifyEmail = () => {
  router.push({ name: "verify.page" });
};
</script>

<template>
  <section class="h-dvh absolute w-full z-10 flex justify-center items-center">
    <UCard>
      <template #header>{{ "E-mail não verificado!" }}</template>

      <p class="pb-4">
        Para utilizar nossa ferramenta, é necessário verificar seu e-mail.
      </p>

      <UButton label="Verificar e-mail" block @click="verifyEmail" />
    </UCard>
  </section>

  <section
    class="flex h-dvh absolute w-full justify-center items-center flex-col opacity-60 z-0"
  >
    <USkeleton class="h-[100px] w-[350px]" />
    <!-- <USkeleton class="h-[50px] w-[200px] mt-[20px]" /> -->

    <section class="flex gap-3 mt-[40px]">
      <USkeleton v-for="i in 4" class="h-[20px] w-[100px]" />
    </section>

    <USkeleton class="h-[200px] w-[400px] mt-[40px]" />

    <USkeleton class="h-[20px] w-[200px] mt-[30px]" />
  </section>
</template>

<style></style>
