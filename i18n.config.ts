import ptBr from "./components/translates/ptBr";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "pt-BR",
  messages: {
    // en: {
    //   welcome: "Welcome",
    // },
    "pt-BR": ptBr,
  },
}));

