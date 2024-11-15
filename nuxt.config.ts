// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  site: {
    url: "https://registrameutempoai.com.br",
    name: "Registra meu tempo aí! - Gerenciador de Tempo",
    defaultLocale: "pt-BR",
  },

  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "nuxt-viewport",
    "nuxt-gtag",
    "@nuxt/image",
    "@nuxtjs/seo",
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
      apiBase: process.env.API_BASE,
      onlyGuestMode: process.env.ONLY_GUEST_MODE,
      registerFormMockEnable: process.env.REGISTER_FORM_MOCK_ENABLE,
      registerFormMockName: process.env.REGISTER_FORM_MOCK_NAME,
      registerFormMockEmail: process.env.REGISTER_FORM_MOCK_EMAIL,
      registerFormMockCode: process.env.REGISTER_FORM_MOCK_CODE,
      registerFormMockPassword: process.env.REGISTER_FORM_MOCK_PASSWORD,
      enableWarTools: process.env.ENABLE_WAR_TOOLS,
      oldUserToken: process.env.OLD_USER_TOKEN,
    },
  },

  compatibilityDate: "2024-10-09",
});
