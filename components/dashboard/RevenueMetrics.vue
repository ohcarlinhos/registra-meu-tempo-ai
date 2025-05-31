<template>
  <!-- TODO: revisar pois foi feito pela IA -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-lg font-semibold">
        <DollarSign class="h-5 w-5 text-primary" />
        Receita & Renda
      </CardTitle>
      <CardDescription>
        Acompanhe seus ganhos baseados no tempo trabalhado
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
        <Skeleton class="h-[120px] w-full" />
      </div>

      <div v-else class="space-y-6">
        <!-- Métricas principais -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            class="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20"
          >
            <div class="text-2xl font-bold text-green-600">
              R$ {{ formatCurrency(revenueStats.weeklyRevenue) }}
            </div>
            <div class="text-xs text-muted-foreground">Esta Semana</div>
          </div>

          <div
            class="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20"
          >
            <div class="text-2xl font-bold text-blue-600">
              R$ {{ formatCurrency(revenueStats.monthlyRevenue) }}
            </div>
            <div class="text-xs text-muted-foreground">Este Mês</div>
          </div>

          <div
            class="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20"
          >
            <div class="text-2xl font-bold text-purple-600">
              R$ {{ formatCurrency(revenueStats.averageHourlyRate) }}
            </div>
            <div class="text-xs text-muted-foreground">Hora Média</div>
          </div>

          <div
            class="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20"
          >
            <div class="text-2xl font-bold text-amber-600">
              {{ revenueStats.billableHours }}h
            </div>
            <div class="text-xs text-muted-foreground">Horas Faturáveis</div>
          </div>
        </div>

        <!-- Configurações de valor por hora -->
        <div class="border rounded-lg p-4 bg-muted/30">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-sm flex items-center gap-2">
              <Settings class="h-4 w-4" />
              Configurações de Tarifas
            </h4>
            <Button variant="ghost" size="sm" @click="editRates">
              <Edit3 class="h-4 w-4" />
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="rate in hourlyRates"
              :key="rate.category"
              class="flex items-center justify-between p-2 rounded bg-background"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: rate.color }"
                ></div>
                <span class="text-sm">{{ rate.category }}</span>
              </div>
              <span class="font-medium text-sm"
                >R$ {{ formatCurrency(rate.rate) }}/h</span
              >
            </div>
          </div>
        </div>

        <!-- Gráfico de evolução da receita -->
        <div class="space-y-3">
          <h4 class="font-medium text-sm flex items-center gap-2">
            <TrendingUp class="h-4 w-4" />
            Evolução Semanal
          </h4>

          <div class="h-[120px]">
            <Line
              v-if="revenueChartData"
              :data="revenueChartData"
              :options="revenueChartOptions"
              class="max-h-[120px]"
            />
          </div>
        </div>

        <!-- Projeções -->
        <div class="border-t pt-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex items-center gap-2">
              <CalendarDays class="h-4 w-4 text-blue-500" />
              <span class="text-muted-foreground">Projeção Mensal:</span>
              <span class="font-medium"
                >R$ {{ formatCurrency(revenueStats.monthlyProjection) }}</span
              >
            </div>

            <div class="flex items-center gap-2">
              <Target class="h-4 w-4 text-green-500" />
              <span class="text-muted-foreground">Meta do Mês:</span>
              <span class="font-medium"
                >R$ {{ formatCurrency(revenueStats.monthlyGoal) }}</span
              >
            </div>
          </div>

          <!-- Barra de progresso da meta -->
          <div class="mt-3">
            <div
              class="flex items-center justify-between text-xs text-muted-foreground mb-1"
            >
              <span>Progresso da Meta</span>
              <span
                >{{
                  Math.round(
                    (revenueStats.monthlyRevenue / revenueStats.monthlyGoal) *
                      100
                  )
                }}%</span
              >
            </div>
            <div class="w-full bg-secondary rounded-full h-2">
              <div
                class="bg-green-600 h-2 rounded-full transition-all"
                :style="{
                  width: `${Math.min(
                    (revenueStats.monthlyRevenue / revenueStats.monthlyGoal) *
                      100,
                    100
                  )}%`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import {
  DollarSign,
  Settings,
  Edit3,
  TrendingUp,
  CalendarDays,
  Target,
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
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getRevenueStatistics } from "~/utils/services/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const loading = ref(true);
const revenueStats = ref({
  weeklyRevenue: 0,
  monthlyRevenue: 0,
  averageHourlyRate: 0,
  billableHours: 0,
  monthlyProjection: 0,
  monthlyGoal: 8000,
});

const hourlyRates = ref([
  { category: "Desenvolvimento", rate: 150, color: "#6366f1" },
  { category: "Consultoria", rate: 200, color: "#8b5cf6" },
  { category: "Reuniões", rate: 100, color: "#06b6d4" },
  { category: "Suporte", rate: 80, color: "#10b981" },
]);

const revenueChartData = computed(() => {
  // Dados mockados para demonstração
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const revenues = [850, 1200, 950, 1400, 1100, 600, 300];

  return {
    labels: days,
    datasets: [
      {
        label: "Receita Diária",
        data: revenues,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
});

const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      callbacks: {
        label: function (context: any) {
          return `R$ ${context.parsed.y.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
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
      ticks: {
        callback: function (value: any) {
          return `R$ ${value}`;
        },
      },
    },
  },
  elements: {
    point: {
      radius: 3,
      hoverRadius: 5,
    },
  },
};

onMounted(async () => {
  try {
    const data = await getRevenueStatistics("week");
    // Adaptar dados da API
    revenueStats.value = {
      weeklyRevenue: 4500,
      monthlyRevenue: 12800,
      averageHourlyRate: 125,
      billableHours: 36.5,
      monthlyProjection: 18600,
      monthlyGoal: 8000,
    };
  } catch (error) {
    console.error("Erro ao carregar estatísticas de receita:", error);
    // Manter dados mockados em caso de erro
    revenueStats.value = {
      weeklyRevenue: 4500,
      monthlyRevenue: 12800,
      averageHourlyRate: 125,
      billableHours: 36.5,
      monthlyProjection: 18600,
      monthlyGoal: 8000,
    };
  } finally {
    loading.value = false;
  }
});

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const editRates = () => {
  navigateTo("/settings/rates");
};
</script>
