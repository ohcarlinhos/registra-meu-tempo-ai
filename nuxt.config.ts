// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/ui", "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
  ui: { global: true },
  imports: {
    dirs: ["composables/**", "utils/**"],
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE,
    },
  },
});

