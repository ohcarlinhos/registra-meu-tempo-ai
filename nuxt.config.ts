// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  ssr: true,

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
    "@nuxtjs/turnstile",
    "@nuxtjs/seo",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "nuxt-auth-utils",
  ],

  shadcn: {
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },

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
    debug: true,
  },

  runtimeConfig: {
    public: {
      externalBaseURL: "",

      onlyGuestMode: "0",
      enableWarTools: "",
      oldUserToken: "",

      registerFormMockEnable: "0",
      registerFormMockName: "",
      registerFormMockEmail: "",
      registerFormMockCode: "",
      registerFormMockPassword: "",

      enableUserChallenge: process.env.NODE_ENV === "production",
    },
    externalBaseURL: "",
  },

  compatibilityDate: "2024-10-09",
});
