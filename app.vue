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
const { setExpiredToken } = authStore;
const { authModal } = storeToRefs(authStore);

const cs = useConfigStore();

const setOldToken = () => {
  setExpiredToken();
};

onMounted(() => {
  setTitle();
});
</script>

<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <UButton
      :ui="{ base: 'absolute lg:fixed top-2 left-2 z-50' }"
      :icon="
        isDark ? 'i-icon-park-outline-moon' : 'i-icon-park-outline-sun-one'
      "
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="toggleDark"
    />

    <section v-if="cs.hasWarTools" class="fixed top-2 right-2 z-50">
      <UButton @click="setOldToken"> Set Old Token </UButton>
    </section>

    <UModal v-model="authModal.open" prevent-close>
      <AuthFormLogin v-if="authModal.open" />
    </UModal>

    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>
