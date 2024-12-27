<script lang="ts" setup>
useHead({
  titleTemplate: "%s %separator %siteName",
  templateParams: {
    separator: "—", // choose a seperator
    siteName: "Registra meu tempo aí!", // set a site name
  },
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
const { setExpiredToken, clearSession } = authStore;
const { authModal, isAuth } = storeToRefs(authStore);

const userStore = useUserStore();
const { isVerified, isFetch: mySelfIsFetch } = storeToRefs(userStore);

const configStore = useConfigStore();

const router = useRouter();

const setOldToken = () => {
  setExpiredToken();
};

const showNotVerifiedStatus = computed(() => {
  return isAuth.value && !mySelfIsFetch.value && !isVerified.value;
});
</script>

<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <section
      :class="[
        'absolute lg:fixed p-2 flex justify-between w-full z-50 gap-2',
        showNotVerifiedStatus && 'bg-red-500 bg-opacity-50',
      ]"
    >
      <UButton
        :icon="
          isDark ? 'i-icon-park-outline-sun-one' : 'i-icon-park-outline-moon'
        "
        :label="!isDark && 'Experimente a noite...'"
        title="Na opinião dos desenvolvedores, o modo noturno é bem mais bonito e agradável."
        color="gray"
        variant="ghost"
        @click="toggleDark"
      />

      <section
        v-if="showNotVerifiedStatus"
        class="font-medium pt-1 dark:text-white text-gray-600"
      >
        <ULink
          @click="() => $router.push({ name: 'verify.page' })"
          class="dark:text-blue-300 text-blue-500"
        >
          Clique aqui para verificar seu e-mail
        </ULink>

        e utilizar nossas ferramentas, ou
        <ULink @click="logout" class="dark:text-blue-300 text-blue-500">
          clique aqui para sair
        </ULink>
        da sua conta.
      </section>

      <section class="flex gap-2">
        <UButton @click="setOldToken" v-if="configStore.hasWarTools">
          Definir Token Antigo
        </UButton>

        <UButton
          @click="() => router.push({ name: 'verify.page' })"
          v-if="configStore.hasWarTools"
        >
          Verificar e-mail
        </UButton>
      </section>
    </section>

    <UModal v-model="authModal.open" prevent-close>
      <AuthFormLogin v-if="authModal.open" />
    </UModal>

    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>
