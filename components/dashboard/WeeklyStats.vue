<template>
  <!-- TODO: revisar pois foi feito pela IA -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-lg font-semibold">
        <BarChart3 class="h-5 w-5 text-primary" />
        Estatísticas Semanais
      </CardTitle>
      <CardDescription>
        {{ formatWeekPeriod() }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div v-if="loading" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="space-y-2">
            <Skeleton class="h-4 w-[100px]" />
            <Skeleton class="h-8 w-[80px]" />
          </div>
        </div>
        <Skeleton class="h-[200px] w-full" />
      </div>

      <div v-else-if="weekStats" class="space-y-6">
        <!-- Métricas principais -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-3 rounded-lg bg-primary/5">
            <div class="text-2xl font-bold text-primary">
              {{ weekStats.totalHours }}
            </div>
            <div class="text-xs text-muted-foreground">Total de Horas</div>
          </div>

          <div
            class="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20"
          >
            <div class="text-2xl font-bold text-blue-600">
              {{ weekStats.dailyAverage }}
            </div>
            <div class="text-xs text-muted-foreground">Média Diária</div>
          </div>

          <div
            class="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20"
          >
            <div class="text-2xl font-bold text-green-600">
              {{ weekStats.totalSessions }}
            </div>
            <div class="text-xs text-muted-foreground">Sessões</div>
          </div>

          <div
            class="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20"
          >
            <div class="text-2xl font-bold text-purple-600">
              {{ weekStats.completedGoals }}
            </div>
            <div class="text-xs text-muted-foreground">Metas Concluídas</div>
          </div>
        </div>

        <!-- Gráfico semanal -->
        <div class="h-[200px]">
          <Line
            v-if="chartData"
            :data="chartData"
            :options="chartOptions"
            class="max-h-[200px]"
          />
        </div>

        <!-- Informações adicionais -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-center gap-2">
            <TrendingUp class="h-4 w-4 text-green-500" />
            <span class="text-muted-foreground">Dia mais produtivo:</span>
            <span class="font-medium">{{ weekStats.mostProductiveDay }}</span>
          </div>

          <div class="flex items-center gap-2">
            <TrendingDown class="h-4 w-4 text-red-500" />
            <span class="text-muted-foreground">Dia menos produtivo:</span>
            <span class="font-medium">{{ weekStats.leastProductiveDay }}</span>
          </div>
        </div>

        <!-- Receita (se disponível) -->
        <div v-if="weekStats.totalRevenue" class="border-t pt-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex items-center gap-2">
              <DollarSign class="h-4 w-4 text-green-500" />
              <span class="text-muted-foreground">Receita Total:</span>
              <span class="font-medium"
                >R$ {{ formatCurrency(weekStats.totalRevenue) }}</span
              >
            </div>

            <div class="flex items-center gap-2">
              <Calculator class="h-4 w-4 text-blue-500" />
              <span class="text-muted-foreground">Receita Média:</span>
              <span class="font-medium"
                >R$ {{ formatCurrency(weekStats.averageRevenue || 0) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-muted-foreground">
        <BarChart3 class="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Nenhum dado disponível</p>
        <p class="text-sm">
          Registre seu tempo para ver as estatísticas semanais
        </p>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
} from "lucide-vue-next";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeekStatistic } from "~/utils/services/dashboard";
import type { WeekStatistic } from "~/utils/types/api/map/WeekStatistic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const loading = ref(true);
const weekStats = ref<WeekStatistic | null>(null);

const chartData = computed(() => {
  if (!weekStats.value) return null;

  // Dados mockados para o exemplo - em produção viriam da API
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const hours = [0, 6.5, 7.2, 5.8, 8.1, 6.9, 2.3]; // Exemplo

  return {
    labels: days,
    datasets: [
      {
        label: "Horas Trabalhadas",
        data: hours,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false,
      },
    },
    y: {
      display: true,
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
};

onMounted(async () => {
  try {
    weekStats.value = await getWeekStatistic();
  } catch (error) {
    console.error("Erro ao carregar estatísticas semanais:", error);
  } finally {
    loading.value = false;
  }
});

const formatWeekPeriod = (): string => {
  if (!weekStats.value) return "Esta semana";

  const start = new Date(weekStats.value.startWeek).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "short" }
  );
  const end = new Date(weekStats.value.endWeek).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return `${start} - ${end}`;
};

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>
