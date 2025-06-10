<script lang="ts" setup>
definePageMeta({ name: "home" });
useHead({
  title:
    "Cronômetros, Pomodoro e Estatísticas - Controle de Tempo para Profissionais",
  meta: [
    {
      name: "description",
      content:
        "Ferramenta completa para profissionais que cobram por hora. Controle de tempo preciso, relatórios detalhados e estatísticas para maximizar sua produtividade e faturamento.",
    },
  ],
});
</script>

<template>
  <NuxtLayout name="home">
    <HomeHero />

    <!-- Seção focada em profissionais que cobram por hora -->
    <section class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Maximize seu faturamento
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Desenvolvido para freelancers, consultores e profissionais autônomos
            que precisam controlar o tempo com precisão para cobrar
            adequadamente por seus serviços.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="text-center p-6 bg-white rounded-lg shadow-md">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-muted">
              Controle Preciso
            </h3>
            <p class="text-gray-600">
              Registre cada minuto trabalhado com cronômetros intuitivos e
              organize por projeto ou cliente.
            </p>
          </div>

          <div class="text-center p-6 bg-white rounded-lg shadow-md">
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-muted">
              Relatórios Detalhados
            </h3>
            <p class="text-gray-600">
              Gere relatórios profissionais com breakdown por projeto, cliente e
              período para suas cobranças.
            </p>
          </div>

          <div class="text-center p-6 bg-white rounded-lg shadow-md">
            <div
              class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-muted">
              Aumente sua Produtividade
            </h3>
            <p class="text-gray-600">
              Use técnicas como Pomodoro e visualize estatísticas para otimizar
              seu tempo e aumentar o faturamento.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção de benefícios específicos -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
            Por que nossa ferramenta?
          </h2>

          <div class="space-y-8">
            <div class="flex items-start gap-6">
              <div
                class="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-bold">1</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">
                  Cobrança Justa e Transparente
                </h3>
                <p class="text-muted-foreground">
                  Registre cada minuto trabalhado e tenha dados precisos para
                  cobrar pelo tempo investido em seus projeto.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-6">
              <div
                class="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-bold">2</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">
                  Organização por Cliente/Projeto
                </h3>
                <p class="text-muted-foreground">
                  Categorize seu tempo por cliente, projeto ou tipo de
                  atividade. Tenha visibilidade de onde seu tempo está sendo
                  investido.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-6">
              <div
                class="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-bold">3</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">
                  Relatórios Profissionais
                </h3>
                <p class="text-muted-foreground">
                  Gere relatórios detalhados para enviar aos clientes, com
                  breakdown de atividades e tempo investido em cada tarefa.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-6">
              <div
                class="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-bold">4</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">
                  Análise de Produtividade
                </h3>
                <p class="text-muted-foreground">
                  Identifique seus horários mais produtivos, otimize sua agenda
                  e aumente seu valor por hora através de insights baseados em
                  dados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-blue-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Comece a controlar seu tempo hoje!
        </h2>
        <p class="text-xl mb-8 opacity-90">
          Junte-se a centenas de profissionais que já otimizaram seu faturamento
          com nossa ferramenta.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/register"
            class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Criar conta agora!
          </NuxtLink>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
