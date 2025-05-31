<template>
  <!-- TODO: revisar pois foi feito pela IA -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-lg font-semibold">
        <Target class="h-5 w-5 text-primary" />
        Metas Ativas
      </CardTitle>
      <CardDescription> Acompanhe o progresso das suas metas </CardDescription>
    </CardHeader>

    <CardContent class="space-y-4">
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="space-y-3">
          <div class="flex items-center justify-between">
            <Skeleton class="h-4 w-[180px]" />
            <Skeleton class="h-4 w-[60px]" />
          </div>
          <Skeleton class="h-2 w-full" />
          <Skeleton class="h-3 w-[120px]" />
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="goal in activeGoals"
          :key="goal.id"
          class="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-sm">{{ goal.title }}</h4>
            <Badge
              :variant="
                goal.priority === 'high'
                  ? 'destructive'
                  : goal.priority === 'medium'
                  ? 'default'
                  : 'secondary'
              "
            >
              {{ priorityLabels[goal.priority] }}
            </Badge>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Progresso</span>
              <span class="font-medium">{{ formatProgress(goal) }}%</span>
            </div>

            <!-- <Progress :value="getProgressPercentage(goal)" class="h-2" /> -->

            <div
              class="flex items-center justify-between text-xs text-muted-foreground"
            >
              <span>{{ goal.currentHours }}h / {{ goal.targetHours }}h</span>
              <span v-if="goal.deadline">{{
                formatDeadline(goal.deadline)
              }}</span>
            </div>
          </div>

          <div
            v-if="goal.description"
            class="mt-2 text-xs text-muted-foreground"
          >
            {{ goal.description }}
          </div>
        </div>

        <div
          v-if="activeGoals.length === 0"
          class="text-center py-8 text-muted-foreground"
        >
          <Target class="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma meta ativa</p>
          <p class="text-sm">
            Crie suas primeiras metas para acompanhar seu progresso
          </p>
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <Button variant="outline" class="flex-1" @click="createNewGoal">
          <Plus class="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
        <Button variant="outline" @click="viewAllGoals">
          Ver Todas
          <ArrowRight class="h-4 w-4 ml-2" />
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Target, Plus, ArrowRight } from "lucide-vue-next";

const loading = ref(true);
const activeGoals = ref<Goal[]>([]);

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

onMounted(async () => {
  try {
    activeGoals.value = await getActiveGoals();
  } catch (error) {
    console.error("Erro ao carregar metas ativas:", error);
  } finally {
    loading.value = false;
  }
});

const getProgressPercentage = (goal: Goal): number => {
  return Math.min((goal.currentHours / goal.targetHours) * 100, 100);
};

const formatProgress = (goal: Goal): string => {
  return getProgressPercentage(goal).toFixed(0);
};

const formatDeadline = (deadline: string): string => {
  const date = new Date(deadline);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Vencida";
  if (diffDays === 0) return "Vence hoje";
  if (diffDays === 1) return "Vence amanhã";
  return `${diffDays} dias restantes`;
};

const createNewGoal = () => {
  navigateTo("/goals/create");
};

const viewAllGoals = () => {
  navigateTo("/goals");
};
</script>
