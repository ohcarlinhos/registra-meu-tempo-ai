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
      <div class="lg:col-span-2 space-y-6">
        <!-- Weekly Stats Chart -->
        <WeeklyStats />

        <!-- Time Distribution Pie Chart -->
        <TimeDistribution />
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Common Tasks -->
        <CommonTasks />

        <!-- Active Goals -->
        <ActiveGoals />
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Completed Goals -->
      <CompletedGoals />

      <!-- Revenue Metrics -->
      <RevenueMetrics />
    </div>

    <!-- Tasks with Weekly and Total Time -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-lg font-semibold">
          <FileText class="h-5 w-5 text-primary" />
          Resumo de Tarefas
        </CardTitle>
        <CardDescription> Tempo semanal e total por tarefa </CardDescription>
      </CardHeader>

      <CardContent>
        <div v-if="loadingTasks" class="space-y-3">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center justify-between"
          >
            <Skeleton class="h-4 w-[200px]" />
            <div class="flex gap-4">
              <Skeleton class="h-4 w-[80px]" />
              <Skeleton class="h-4 w-[80px]" />
            </div>
          </div>
        </div>

        <div v-else class="space-y-2">
          <div
            class="flex items-center justify-between text-sm font-medium text-muted-foreground border-b pb-2"
          >
            <span>Tarefa</span>
            <div class="flex gap-8">
              <span>Semanal</span>
              <span>Total</span>
            </div>
          </div>

          <div
            v-for="task in tasksSummary"
            :key="task.id"
            class="flex items-center justify-between py-2 hover:bg-accent/50 rounded px-2 transition-colors"
          >
            <span class="font-medium">{{ task.name }}</span>

            <div class="flex gap-8 text-sm">
              <span class="text-blue-600 font-medium">
                {{ task.weeklyTime }}
              </span>

              <span class="text-green-600 font-medium">
                {{ task.totalTime }}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import {
  Clock,
  Calendar,
  Target,
  TrendingUp,
  RefreshCw,
  Play,
  FileText,
} from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Componentes da dashboard
import WeeklyStats from "./WeeklyStats.vue";
import TimeDistribution from "./TimeDistribution.vue";
import CommonTasks from "./CommonTasks.vue";
import ActiveGoals from "./ActiveGoals.vue";
import CompletedGoals from "./CompletedGoals.vue";
import RevenueMetrics from "./RevenueMetrics.vue";

// Services
import {
  getDashboardMetrics,
  getCommonTasks,
} from "~/utils/services/dashboard";
import { getActiveGoals } from "~/utils/services/goal";

const refreshing = ref(false);
const loadingTasks = ref(true);

// Estados reativas
const todayStats = ref({ hours: 0, minutes: 0 });
const weekStats = ref({ totalHours: "0h" });
const activeGoalsCount = ref(0);
const productivityScore = ref(0);
const tasksSummary = ref<any[]>([]);

// Carregamento inicial
onMounted(async () => {
  await loadDashboardData();
});

const loadDashboardData = async () => {
  try {
    // Carregar métricas principais
    const [metrics, activeGoals, commonTasks] = await Promise.all([
      getDashboardMetrics().catch(() => null),
      getActiveGoals().catch(() => []),
      getCommonTasks(10).catch(() => []),
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

    // Resumo de tarefas
    tasksSummary.value = commonTasks.map((task) => ({
      id: task.id,
      name: task.name,
      weeklyTime: task.weeklyTime,
      totalTime: task.totalTime,
    }));

    // Se não há dados, usar dados mockados
    if (tasksSummary.value.length === 0) {
      tasksSummary.value = [
        {
          id: "1",
          name: "Desenvolvimento Frontend",
          weeklyTime: "12h 30m",
          totalTime: "156h 20m",
        },
        {
          id: "2",
          name: "Reuniões de Projeto",
          weeklyTime: "6h 45m",
          totalTime: "89h 15m",
        },
        {
          id: "3",
          name: "Code Review",
          weeklyTime: "4h 15m",
          totalTime: "67h 30m",
        },
        {
          id: "4",
          name: "Documentação",
          weeklyTime: "3h 20m",
          totalTime: "45h 10m",
        },
        {
          id: "5",
          name: "Testes e QA",
          weeklyTime: "2h 10m",
          totalTime: "34h 25m",
        },
      ];
    }
  } catch (error) {
    console.error("Erro ao carregar dados da dashboard:", error);
  } finally {
    loadingTasks.value = false;
  }
};

const refreshData = async () => {
  refreshing.value = true;
  try {
    await loadDashboardData();
  } finally {
    refreshing.value = false;
  }
};

const startTimer = () => {
  navigateTo("/timer");
};
</script>
