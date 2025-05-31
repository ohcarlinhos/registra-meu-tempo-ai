<script lang="ts" setup>
import { FileText } from "lucide-vue-next";

interface TaskSummary {
  id: string;
  name: string;
  weeklyTime: string;
  totalTime: string;
}

const loading = ref(true);
const tasks = ref<TaskSummary[]>([]);

onMounted(async () => {
  try {
    // const commonTasks = await getCommonTasks(10);

    // tasks.value = commonTasks.map((task) => ({
    //   id: task.id,
    //   name: task.name,
    //   weeklyTime: task.weeklyTime,
    //   totalTime: task.totalTime,
    // }));

    // Se não há dados, usar dados mockados
    if (tasks.value.length === 0) {
      tasks.value = [
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
    console.error("Erro ao carregar resumo de tarefas:", error);
    // Dados mockados em caso de erro
    tasks.value = [
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
    ];
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-lg font-semibold">
        <FileText class="h-5 w-5 text-primary" />
        Resumo de Tarefas
      </CardTitle>
      <CardDescription> Tempo semanal e total por tarefa </CardDescription>
    </CardHeader>

    <CardContent>
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between">
          <Skeleton class="h-4 w-[200px]" />
          <div class="flex gap-4">
            <Skeleton class="h-4 w-[80px]" />
            <Skeleton class="h-4 w-[80px]" />
          </div>
        </div>
      </div>

      <div v-else-if="tasks.length > 0" class="space-y-2">
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
          v-for="task in tasks"
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

      <div v-else class="text-center py-12 text-muted-foreground">
        <FileText class="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p class="font-medium">Nenhuma tarefa encontrada</p>
        <p class="text-sm">Registre seu tempo para ver o resumo de tarefas</p>
      </div>
    </CardContent>
  </Card>
</template>
