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
  "Ferramenta completa para profissionais que cobram por hora. Controle de tempo preciso, relatórios detalhados e estatísticas para maximizar sua produtividade e faturamento.";

const twitterImageAlt =
  "Registra meu tempo aí! — Controle de tempo para profissionais que cobram por hora.";

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
  <Toaster />
  <NuxtLoadingIndicator />
  <NuxtPage />
</template>
