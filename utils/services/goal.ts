// TODO: revisar pois foi feito pela IA
import type { Goal, GoalProgress } from "~/utils/types/api/map/Goal";

export const createGoal = async (
  goalData: Omit<
    Goal,
    "id" | "createdAt" | "updatedAt" | "currentHours" | "completed"
  >
): Promise<Goal> => {
  const { data } = await $fetch<{ data: Goal }>("/api/goals", {
    method: "POST",
    body: goalData,
  });
  return data;
};

export const getGoals = async (): Promise<Goal[]> => {
  const { data } = await $fetch<{ data: Goal[] }>("/api/goals");
  return data;
};

export const getActiveGoals = async (): Promise<Goal[]> => {
  const { data } = await $fetch<{ data: Goal[] }>("/api/goals?status=active");
  return data;
};

export const getGoalProgress = async (
  goalId: string
): Promise<GoalProgress> => {
  const { data } = await $fetch<{ data: GoalProgress }>(
    `/api/goals/${goalId}/progress`
  );
  return data;
};

export const updateGoal = async (
  goalId: string,
  updates: Partial<Goal>
): Promise<Goal> => {
  const { data } = await $fetch<{ data: Goal }>(`/api/goals/${goalId}`, {
    method: "PUT",
    body: updates,
  });
  return data;
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  await $fetch(`/api/goals/${goalId}`, {
    method: "DELETE",
  });
};

export const completeGoal = async (goalId: string): Promise<Goal> => {
  const { data } = await $fetch<{ data: Goal }>(
    `/api/goals/${goalId}/complete`,
    {
      method: "POST",
    }
  );
  return data;
};
