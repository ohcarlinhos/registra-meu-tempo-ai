<script lang="ts" setup>
definePageMeta({ name: "verify.page.code" });
useHead({ title: "Verificar conta" });

const isFetch = ref(false);

const userStore = useUserStore();
const { checkIfIsVerified } = userStore;
const { isVerified } = storeToRefs(userStore);

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await initCode();
});

const initCode = async () => {
  if (isVerified.value) {
    return router.push({ name: "record.panel" });
  }

  await verifyCode();
};

const verifyCode = async () => {
  if (!route.params.code) return;

  try {
    isFetch.value = true;

    const result = await verifyRegisterCode(route.params.code as string);
    if (!result) return;

    const isVerified = await checkIfIsVerified();

    if (isVerified) {
      router.push({ name: "record.panel" });
    }
  } catch (err: any) {
    ErrorToast(err);

    if (
      ["recovery_code_not_found", "recovery_code_is_used_or_expired"].includes(
        err.message
      )
    ) {
      router.push({ name: "verify.page" });
    }
  } finally {
    isFetch.value = false;
  }
};
</script>

<template>
  <NuxtLayout name="center">
    <UCard :ui="{ base: 'w-full' }">
      <section class="flex justify-center">
        <UIcon
          v-if="isFetch"
          name="i-svg-spinners-180-ring-with-bg"
          class="w-7 h-7 opacity-40"
        />
        <p v-else>Se não foi redirecionado, atualize a tela.</p>
      </section>
    </UCard>
  </NuxtLayout>
</template>
