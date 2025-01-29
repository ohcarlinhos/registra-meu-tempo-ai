// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  experimental: {
    inlineRouteRules: true,
    // renderJsonPayloads: false,
  },

  imports: {
    dirs: ["composables/**", "utils/**"],
  },

  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },

  modules: [
    "@nuxt/ui",
    "@nuxt/icon",
    "@pinia/nuxt",
    "@nuxt/image",
    "@pinia/colada-nuxt",
    "@nuxtjs/robots",
    "@nuxtjs/i18n",
    "nuxt-gtag",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-clarity-analytics",
    "nuxt-site-config",
    "nuxt-seo-utils",
    "@nuxtjs/turnstile",
  ],

  site: {
    url: "https://registrameutempoai.com.br",
    name: "Registra meu tempo aí!",
  },

  seo: {
    fallbackTitle: false,
  },

  colorMode: {
    preference: "dark",
  },

  i18n: {
    vueI18n: "./i18n.config.ts",
  },

  gtag: {
    enabled: process.env.NODE_ENV === "production",
    id: process.env.GTAG,
  },

  piniaPluginPersistedstate: {
    storage: "localStorage",
    debug: true,
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "http://localhost:5051/api",

      onlyGuestMode: process.env.ONLY_GUEST_MODE || "0",
      enableWarTools: process.env.ENABLE_WAR_TOOLS || "",
      oldUserToken: process.env.OLD_USER_TOKEN || "",

      rfmEnable: process.env.REGISTER_FORM_MOCK_ENABLE || "0",
      rfmName: process.env.REGISTER_FORM_MOCK_NAME || "",
      rfmEmail: process.env.REGISTER_FORM_MOCK_EMAIL || "",
      rfmCode: process.env.REGISTER_FORM_MOCK_CODE || "",
      rfmPassword: process.env.REGISTER_FORM_MOCK_PASSWORD || "",

      enableUserChallenge: process.env.NODE_ENV === "production",
    },
  },

  compatibilityDate: "2024-10-09",
});
