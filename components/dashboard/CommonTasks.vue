<template>
  <!-- TODO: revisar pois foi feito pela IA -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-lg font-semibold">
        <Clock class="h-5 w-5 text-primary" />
        Tarefas Mais Comuns
      </CardTitle>
      <CardDescription> Suas atividades mais frequentes </CardDescription>
    </CardHeader>

    <CardContent class="space-y-4">
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
          <Skeleton class="h-10 w-10 rounded-full" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-[200px]" />
            <Skeleton class="h-3 w-[100px]" />
          </div>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="task in commonTasks"
          :key="task.id"
          class="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
          @click="selectTask(task)"
        >
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-full bg-primary/10">
              <FolderOpen class="h-4 w-4 text-primary" />
            </div>
            <div>
              <p class="font-medium text-sm">{{ task.name }}</p>
              <div
                class="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span>{{ task.weeklyTime }} esta semana</span>
                <span>•</span>
                <span>{{ task.frequency }} sessões</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-sm">{{ task.totalTime }}</p>
            <p class="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        <div
          v-if="commonTasks.length === 0"
          class="text-center py-8 text-muted-foreground"
        >
          <FolderOpen class="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma tarefa encontrada</p>
          <p class="text-sm">
            Comece registrando seu tempo para ver suas tarefas mais comuns
          </p>
        </div>
      </div>

      <Button variant="outline" class="w-full mt-4" @click="viewAllTasks">
        Ver Todas as Tarefas
        <ArrowRight class="h-4 w-4 ml-2" />
      </Button>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Clock, FolderOpen, ArrowRight } from "lucide-vue-next";
import { getCommonTasks } from "~/utils/services/dashboard";
import type { CommonTask } from "~/utils/types/api/map/WeekStatistic";

const loading = ref(true);
const commonTasks = ref<CommonTask[]>([]);

onMounted(async () => {
  try {
    commonTasks.value = await getCommonTasks(8);
  } catch (error) {
    console.error("Erro ao carregar tarefas comuns:", error);
  } finally {
    loading.value = false;
  }
});

const selectTask = (task: CommonTask) => {
  // Emit event or navigate to task details
  console.log("Task selected:", task);
};

const viewAllTasks = () => {
  navigateTo("/tasks");
};
</script>
