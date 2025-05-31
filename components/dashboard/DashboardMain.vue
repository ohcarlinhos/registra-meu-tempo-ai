<script lang="ts" setup>
import { Clock, Calendar, Target, TrendingUp } from "lucide-vue-next";
import { getDashboardMetrics } from "~/utils/services/dashboard";

// Mock function para getActiveGoals (assumindo que existe em algum lugar)
const getActiveGoals = async () => {
  // Retorna dados mockados por enquanto
  return [
    { id: 1, name: "Meta 1" },
    { id: 2, name: "Meta 2" },
  ];
};

// Estados reativas
const todayStats = ref({ hours: 0, minutes: 0 });
const weekStats = ref({ totalHours: "0h" });
const activeGoalsCount = ref(0);
const productivityScore = ref(0);

// Carregamento inicial
onMounted(async () => {
  await loadDashboardData();
});

const loadDashboardData = async () => {
  try {
    // Carregar métricas principais
    const [metrics, activeGoals] = await Promise.all([
      getDashboardMetrics().catch(() => null),
      getActiveGoals().catch(() => []),
    ]);

    // Dados de hoje (mockados por enquanto)
    todayStats.value = { hours: 6, minutes: 30 };

    // Estatísticas da semana
    if (metrics?.weeklyStats) {
      weekStats.value = { totalHours: metrics.weeklyStats.totalHours };
    } else {
      weekStats.value = { totalHours: "28h 45m" };
    }

    // Contagem de metas ativas
    activeGoalsCount.value = activeGoals.length;

    // Score de produtividade (mockado)
    productivityScore.value = 87;
  } catch (error) {
    console.error("Erro ao carregar dados da dashboard:", error);
  }
};
</script>

<template>
  <!-- TODO: revisar pois foi feito pela IA -->
  <div class="flex flex-col gap-5">
    <GTitlePage
      title="Dashboard"
      description="Visão geral do seu controle de tempo e produtividade"
    />

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-full bg-primary/10">
            <Clock class="h-5 w-5 text-primary" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Hoje</p>
            <p class="text-2xl font-bold">
              {{ todayStats.hours }}h {{ todayStats.minutes }}m
            </p>
          </div>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-full bg-blue-500/10">
            <Calendar class="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Esta Semana</p>
            <p class="text-2xl font-bold">{{ weekStats.totalHours }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-full bg-green-500/10">
            <Target class="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Metas Ativas</p>
            <p class="text-2xl font-bold">{{ activeGoalsCount }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-full bg-amber-500/10">
            <TrendingUp class="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Produtividade</p>
            <p class="text-2xl font-bold">{{ productivityScore }}%</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Weekly Stats Chart -->
        <DashboardWeeklyStats />

        <!-- Time Distribution Pie Chart -->
        <!-- <DashboardTimeDistribution /> -->
      </div>

      <!-- Right Column -->
      <!-- <div class="space-y-6">
        <DashboardCommonTasks />

        <DashboardActiveGoals />
      </div> -->
    </div>

    <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardCompletedGoals />
      <DashboardRevenueMetrics />
    </div> -->

    <!-- Tasks Summary -->
    <DashboardTasksSummary />
  </div>
</template>
