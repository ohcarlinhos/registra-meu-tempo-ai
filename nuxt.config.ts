// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
  ],
  ui: {
    global: true,
    icons: ["icon-park-outline"],
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
  imports: {
    dirs: ["composables/**", "utils/**"],
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE,
      onlyGuestMode: process.env.ONLY_GUEST_MODE,
    },
  },
});
