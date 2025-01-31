<script lang="ts" setup>
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
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/apple-touch-icon.png",
    },
  ],
});

const description =
  "Ferramenta de gerenciamento de tempo com Cronômetros, Pomodoro e Estatísticas com o objetivo de ajudar no foco ao realizar suas tarefas do dia a dia.";

const twitterImageAlt =
  "Registra meu tempo aí! — Pomodoro, Cronômetro e Estatísticas — Controle seu tempo e mantenha-se focado.";

useSeoMeta({
  description,
  ogImage: "/og-image.png",
  ogDescription: description,
  twitterTitle: "Registra meu tempo aí!",
  twitterDescription: description,
  twitterImageAlt,
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtPage />
  <UNotifications />
</template>
