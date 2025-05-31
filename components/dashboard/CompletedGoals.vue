<template>
  <!-- TODO: revisar pois foi feito pela IA -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-lg font-semibold">
        <Trophy class="h-5 w-5 text-primary" />
        Metas Alcançadas
      </CardTitle>
      <CardDescription> Suas conquistas recentes </CardDescription>
    </CardHeader>

    <CardContent>
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="flex items-center gap-3">
          <Skeleton class="h-10 w-10 rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-[180px]" />
            <Skeleton class="h-3 w-[120px]" />
          </div>
          <Skeleton class="h-6 w-[80px]" />
        </div>
      </div>

      <div v-else-if="completedGoals.length > 0" class="space-y-4">
        <div
          v-for="goal in completedGoals"
          :key="goal.id"
          class="flex items-center gap-3 p-3 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
        >
          <div class="flex-shrink-0">
            <div
              class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"
            >
              <CheckCircle2
                class="h-5 w-5 text-green-600 dark:text-green-400"
              />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-sm truncate">{{ goal.title }}</h4>
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{{ goal.targetHours }}h concluídas</span>
              <span>•</span>
              <span>{{ formatCompletionDate(goal.updatedAt) }}</span>
            </div>
            <div v-if="goal.category" class="mt-1">
              <Badge variant="secondary" class="text-xs">
                {{ goal.category }}
              </Badge>
            </div>
          </div>

          <div class="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              @click="viewGoalDetails(goal)"
              class="h-8 w-8 p-0"
            >
              <MoreHorizontal class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <!-- Estatísticas de conquistas -->
        <div class="border-t pt-4 mt-6">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-lg font-bold text-green-600">
                {{ completedGoals.length }}
              </div>
              <div class="text-xs text-muted-foreground">Este Mês</div>
            </div>
            <div>
              <div class="text-lg font-bold text-blue-600">
                {{ totalHoursCompleted }}
              </div>
              <div class="text-xs text-muted-foreground">Horas Totais</div>
            </div>
            <div>
              <div class="text-lg font-bold text-purple-600">
                {{ streakDays }}
              </div>
              <div class="text-xs text-muted-foreground">Dias Seguidos</div>
            </div>
          </div>
        </div>

        <!-- Badges de conquistas -->
        <div class="border-t pt-4">
          <h5 class="font-medium text-sm mb-3 flex items-center gap-2">
            <Medal class="h-4 w-4" />
            Badges Conquistados
          </h5>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="badge in earnedBadges"
              :key="badge.id"
              :variant="badge.variant"
              class="text-xs"
            >
              {{ badge.icon }} {{ badge.name }}
            </Badge>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-muted-foreground">
        <Trophy class="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p class="font-medium">Nenhuma meta concluída ainda</p>
        <p class="text-sm">
          Complete suas primeiras metas para ver suas conquistas aqui
        </p>

        <Button variant="outline" class="mt-4" @click="createFirstGoal">
          <Plus class="h-4 w-4 mr-2" />
          Criar Primeira Meta
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import {
  Trophy,
  CheckCircle2,
  MoreHorizontal,
  Medal,
  Plus,
} from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getGoals } from "~/utils/services/goal";
import type { Goal } from "~/utils/types/api/map/Goal";

const loading = ref(true);
const completedGoals = ref<Goal[]>([]);

// Badges de conquistas mockados
const earnedBadges = ref([
  { id: 1, name: "Primeira Meta", icon: "🎯", variant: "default" as const },
  { id: 2, name: "Maratonista", icon: "🏃", variant: "secondary" as const },
  { id: 3, name: "Consistente", icon: "📅", variant: "outline" as const },
]);

onMounted(async () => {
  try {
    const allGoals = await getGoals();
    completedGoals.value = allGoals
      .filter((goal) => goal.completed)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 10); // Últimas 10 metas concluídas
  } catch (error) {
    console.error("Erro ao carregar metas concluídas:", error);
    // Dados mockados para demonstração
    completedGoals.value = [
      {
        id: "1",
        title: "Estudar React por 40 horas",
        description: "Completar curso avançado de React",
        targetHours: 40,
        currentHours: 40,
        deadline: "2025-05-30",
        completed: true,
        createdAt: "2025-05-01",
        updatedAt: "2025-05-25",
        category: "Estudo",
        priority: "high" as const,
      },
      {
        id: "2",
        title: "Projeto Freelance - 30h",
        description: "Desenvolver aplicação web",
        targetHours: 30,
        currentHours: 30,
        deadline: "2025-05-20",
        completed: true,
        createdAt: "2025-05-05",
        updatedAt: "2025-05-18",
        category: "Trabalho",
        priority: "medium" as const,
      },
    ];
  } finally {
    loading.value = false;
  }
});

const totalHoursCompleted = computed(() => {
  return completedGoals.value.reduce((sum, goal) => sum + goal.targetHours, 0);
});

const streakDays = computed(() => {
  // Calcular dias consecutivos de atividade - mockado por enquanto
  return 7;
});

const formatCompletionDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

const viewGoalDetails = (goal: Goal) => {
  navigateTo(`/goals/${goal.id}`);
};

const createFirstGoal = () => {
  navigateTo("/goals/create");
};
</script>
