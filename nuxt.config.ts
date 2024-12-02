// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "nuxt-viewport",
    "nuxt-gtag",
    "@nuxt/image",
    "@pinia/colada-nuxt",
  ],

  colorMode: {
    preference: "system",
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

  gtag: {
    enabled: process.env.NODE_ENV === "production",
    id: process.env.GTAG,
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || "http://localhost:5051/api",
      onlyGuestMode: process.env.ONLY_GUEST_MODE || "0",
      rfmEnable: process.env.REGISTER_FORM_MOCK_ENABLE || "0",
      rfmName: process.env.REGISTER_FORM_MOCK_NAME || "",
      rfmEmail: process.env.REGISTER_FORM_MOCK_EMAIL || "",
      rfmCode: process.env.REGISTER_FORM_MOCK_CODE || "",
      rfmPassword: process.env.REGISTER_FORM_MOCK_PASSWORD || "",
      enableWarTools: process.env.ENABLE_WAR_TOOLS || "",
      oldUserToken: process.env.OLD_USER_TOKEN || "",
    },
  },

  compatibilityDate: "2024-10-09",
});
