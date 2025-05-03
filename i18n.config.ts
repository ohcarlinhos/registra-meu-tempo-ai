import ptBr from "./translate/ptBr";

export default defineI18nConfig(() => ({
  legacy: false,
  baseUrl: "https://registrameutempoai.com.br",
  locale: "pt-BR",
  locales: [
    {
      code: "pt",
      language: "pt-BR",
    },
  ],
  messages: {
    "pt-BR": ptBr,
  },
}));
