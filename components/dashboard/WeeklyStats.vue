<script lang="ts" setup>
import { BarChart3 } from "lucide-vue-next";
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
import "chartjs-adapter-date-fns";
import { addDays, format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

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
const statistics = ref<RangeStatisticsWithDays | null>(null);

const chartData = computed(() => {
  if (!statistics.value) return null;

  const days = statistics.value.days.map((day) =>
    format(new Date(day.startDay), "dd/MM/yyy", { locale: ptBR })
  );
  const minutes = statistics.value.days.map((day) => day.totalInHours);

  return {
    labels: days,
    datasets: [
      {
        label: "Horas",
        data: minutes,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
      },
    ],
  };
});

const chartOptions = computed(() => {
  var callbacks = {
    title: function (items: any) {
      return `Dia ${items[0].label}`;
    },
    label: function (tooltipItem: any) {
      const idx = tooltipItem.dataIndex;
      const formattedTime = statistics.value?.days[idx].totalHours || "";
      return [formattedTime];
    },
  };

  return {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: isDark.value ? "#262626" : "#e5e5e5",
        },
      },
      y: {
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: isDark.value ? "#262626" : "#e5e5e5",
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        boxPadding: 5,
        padding: 16,
        borderWidth: 1,
        callbacks,
      },
    },
  };
});

onMounted(async () => {
  try {
    const today = startOfDay(new Date());
    statistics.value = await getWeekStatistic(
      addDays(today, -6).toUTCString(),
      today.toUTCString()
    );
  } catch (error) {
    console.error("Erro ao carregar estatísticas semanais:", error);
  } finally {
    loading.value = false;
  }
});

const formatWeekPeriod = (): string => {
  if (!statistics.value?.total) return "Esta semana";

  const start = new Date(statistics.value.total.startDay).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "short" }
  );

  const end = new Date(statistics.value.total.endDay).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "short" }
  );

  return `${start} - ${end}`;
};

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

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

      <div v-else-if="statistics" class="space-y-6">
        <!-- Métricas principais -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-3 rounded-lg bg-primary/5">
            <div class="text-2xl font-bold text-primary">
              {{ statistics.total.totalHours }}
            </div>
            <div class="text-xs text-muted-foreground">Total de Horas</div>
          </div>

          <div
            class="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20"
          >
            <div class="text-2xl font-bold text-blue-600">
              {{ statistics.total.averageHours }}
            </div>
            <div class="text-xs text-muted-foreground">Média Diária</div>
          </div>

          <div
            class="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20"
          >
            <div class="text-2xl font-bold text-green-600">
              {{ statistics.total.activeDaysCount }} de
              {{ statistics.total.daysCount }}
            </div>
            <div class="text-xs text-muted-foreground">Dias com Atividade</div>
          </div>

          <!-- <div
            class="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20"
          >
            <div class="text-2xl font-bold text-purple-600">
              {{ "0" }}
            </div>
            <div class="text-xs text-muted-foreground">Metas Concluídas</div>
          </div> -->
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
        <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-center gap-2">
            <TrendingUp class="h-4 w-4 text-green-500" />
            <span class="text-muted-foreground">Dia mais produtivo:</span>
            <span class="font-medium">{{ weekStats?.mostProductiveDay }}</span>
          </div>

          <div class="flex items-center gap-2">
            <TrendingDown class="h-4 w-4 text-red-500" />
            <span class="text-muted-foreground">Dia menos produtivo:</span>
            <span class="font-medium">{{ weekStats?.leastProductiveDay }}</span>
          </div>
        </div> -->

        <!-- Receita (se disponível) -->
        <!-- <div v-if="weekStats?.totalRevenue" class="border-t pt-4">
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
        </div> -->
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
