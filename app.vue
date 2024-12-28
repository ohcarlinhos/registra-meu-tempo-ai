<script lang="ts" setup>
import { SunIcon, MoonIcon } from "@radix-icons/vue";

useHead({
  titleTemplate: "%s %separator %siteName",
  templateParams: {
    separator: "—",
    siteName: "Registra meu tempo aí!",
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

const authStore = useAuthStore();
const { setExpiredToken } = authStore;
const { authModal, isAuth } = storeToRefs(authStore);

const userStore = useUserStore();
const { isVerified, isFetch: mySelfIsFetch } = storeToRefs(userStore);

const { hasWarTools } = storeToRefs(useConfigStore());

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
      <UIButton
        variant="ghost"
        title="Na opinião dos desenvolvedores, o modo noturno é bem mais bonito e agradável."
        @click="toggleDark"
      >
        <SunIcon v-if="isDark" />
        <MoonIcon v-else />
        {{ isDark ? "" : "Experimente a noite..." }}
      </UIButton>

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
        <UIButton v-if="hasWarTools" variant="secondary" @click="setOldToken">
          Definir Token Antigo
        </UIButton>

        <UIButton
          v-if="hasWarTools"
          variant="secondary"
          @click="() => router.push({ name: 'verify.page' })"
        >
          Verificar e-mail
        </UIButton>
      </section>
    </section>

    <UModal v-model="authModal.open" prevent-close>
      <AuthFormLogin v-if="authModal.open" />
    </UModal>

    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>
