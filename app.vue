<script lang="ts" setup>
useHead({
  meta: [
    { name: "google-adsense-account", content: "ca-pub-5691189191143225" },
  ],
  script: [
    {
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5691189191143225",
      crossorigin: "anonymous",
      async: true,
    },
  ],
});

const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const authStore = useAuthStoreV2();
const { setExpiredToken, clearUserToken } = authStore;
const { authModal, isAuth } = storeToRefs(authStore);

const userStore = useUserStore();
const { checkIfIsVerified } = userStore;
const { isVerified } = storeToRefs(userStore);

const cs = useConfigStore();

const route = useRoute();
const router = useRouter();

const setOldToken = () => {
  setExpiredToken();
};

const exit = () => {
  clearUserToken();
  router.push("/login");
};

const isVerifiedPage = computed(() => {
  return ["verify.page.code", "verify.page"].includes(route.name as string);
});

const showNotVerifiedStatus = computed(() => {
  return !isVerifiedPage.value && !isVerified.value && isAuth.value;
});

const verifyEmail = () => {
  router.push({ name: "verify.page" });

  setTimeout(() => {
    window.location.reload();
  }, 100);
};

onMounted(async () => {
  setTitle();

  if (isAuth.value) {
    await checkIfIsVerified();
  }
});
</script>

<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <section
      :class="[
        'absolute lg:fixed p-2 flex justify-between w-full z-50',
        showNotVerifiedStatus && 'bg-red-500 bg-opacity-50',
      ]"
    >
      <UButton
        :icon="
          isDark ? 'i-icon-park-outline-moon' : 'i-icon-park-outline-sun-one'
        "
        color="gray"
        variant="ghost"
        @click="toggleDark"
      />

      <section
        v-if="showNotVerifiedStatus"
        class="font-medium pt-1 dark:text-white text-gray-600"
      >
        Verifique seu e-mail utilizar as ferramentas, ou
        <ULink @click="exit" class="dark:text-blue-300 text-blue-500">
          clique aqui para sair.
        </ULink>
      </section>

      <section class="flex gap-2">
        <UButton @click="setOldToken" v-if="cs.hasWarTools">
          Definir Token Antigo
        </UButton>

        <UButton
          @click="() => router.push({ name: 'verify.page' })"
          v-if="cs.hasWarTools"
        >
          Verificar e-mail
        </UButton>
      </section>
    </section>

    <UModal v-model="authModal.open" prevent-close>
      <AuthFormLogin v-if="authModal.open" />
    </UModal>

    <section
      v-if="showNotVerifiedStatus"
      class="h-dvh absolute w-full z-10 flex justify-center items-center"
    >
      <UCard>
        <template #header>{{ "E-mail não verificado!" }}</template>

        <p class="pb-4">
          Para utilizar nossa ferramenta, é necessário verificar seu e-mail.
        </p>

        <UButton label="Verificar e-mail" block @click="verifyEmail" />
      </UCard>
    </section>

    <NuxtPage v-else />

    <section
      v-if="showNotVerifiedStatus"
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
  </NuxtLayout>

  <UNotifications />
</template>
