<script lang="ts" setup>
import { PieChart } from "lucide-vue-next";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import { getWeekStatistic } from "~/utils/services/dashboard";
import type { TaskTimeDistribution } from "~/utils/types/api/map/WeekStatistic";

ChartJS.register(ArcElement, Tooltip, Legend);

const loading = ref(true);
const taskDistribution = ref<TaskTimeDistribution[]>([]);

// Cores para o gráfico
const colors = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#84cc16", // lime
  "#f97316", // orange
  "#6b7280", // gray
];

const chartData = computed(() => {
  if (taskDistribution.value.length === 0) return null;

  return {
    labels: taskDistribution.value.map((task) => task.taskName),
    datasets: [
      {
        data: taskDistribution.value.map((task) => task.percentage),
        backgroundColor: colors.slice(0, taskDistribution.value.length),
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverBorderWidth: 3,
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
      callbacks: {
        label: function (context: any) {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ${value.toFixed(1)}%`;
        },
      },
    },
  },
  cutout: "60%",
};

const totalTasks = computed(() => taskDistribution.value.length);
const totalSessions = computed(() =>
  taskDistribution.value.reduce((sum, task) => sum + task.sessionCount, 0)
);

onMounted(async () => {
  try {
    // const weekStats = await getWeekStatistic();
    // taskDistribution.value = weekStats.taskDistribution || [];

    taskDistribution.value = [
      {
        taskName: "Desenvolvimento",
        totalTime: "12h 30m",
        percentage: 45.5,
        sessionCount: 8,
      },
      {
        taskName: "Reuniões",
        totalTime: "6h 45m",
        percentage: 24.6,
        sessionCount: 5,
      },
      {
        taskName: "Documentação",
        totalTime: "4h 15m",
        percentage: 15.4,
        sessionCount: 3,
      },
      {
        taskName: "Planejamento",
        totalTime: "2h 30m",
        percentage: 9.1,
        sessionCount: 2,
      },
      {
        taskName: "Testes",
        totalTime: "1h 30m",
        percentage: 5.4,
        sessionCount: 2,
      },
    ];
  } catch (error) {
    console.error("Erro ao carregar distribuição de tarefas:", error);
    // Dados mockados para demonstração
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <!-- TODO: revisar pois foi feito pela IA -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-lg font-semibold">
        <PieChart class="h-5 w-5 text-primary" />
        Distribuição de Tempo
      </CardTitle>
      <CardDescription>
        Como seu tempo foi distribuído por categoria
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div v-if="loading" class="space-y-4">
        <Skeleton class="h-[250px] w-full rounded-lg" />
        <div class="space-y-2">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <Skeleton class="h-3 w-3 rounded-full" />
              <Skeleton class="h-4 w-[120px]" />
            </div>
            <Skeleton class="h-4 w-[60px]" />
          </div>
        </div>
      </div>

      <div v-else-if="taskDistribution.length > 0" class="space-y-6">
        <!-- Gráfico de Pizza -->
        <div class="flex justify-center">
          <div class="w-[250px] h-[250px]">
            <Doughnut
              v-if="chartData"
              :data="chartData"
              :options="chartOptions"
            />
          </div>
        </div>

        <!-- Legenda -->
        <div class="space-y-3">
          <h4 class="font-medium text-sm">Detalhamento por Tarefa</h4>
          <div class="space-y-2">
            <div
              v-for="(task, index) in taskDistribution"
              :key="task.taskName"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: colors[index % colors.length] }"
                ></div>
                <div>
                  <p class="font-medium text-sm">{{ task.taskName }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ task.sessionCount }} sessões
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-sm">{{ task.totalTime }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ task.percentage.toFixed(1) }}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Estatísticas resumidas -->
        <div class="border-t pt-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="text-center">
              <div class="font-semibold text-lg">{{ totalTasks }}</div>
              <div class="text-muted-foreground">Tarefas Diferentes</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-lg">{{ totalSessions }}</div>
              <div class="text-muted-foreground">Total de Sessões</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-muted-foreground">
        <PieChart class="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p class="font-medium">Nenhum dado para exibir</p>
        <p class="text-sm">
          Registre seu tempo para ver a distribuição por tarefa
        </p>
      </div>
    </CardContent>
  </Card>
</template>
