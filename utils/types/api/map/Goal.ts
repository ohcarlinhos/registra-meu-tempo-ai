// TODO: revisar pois foi feito pela IA
export type Goal = {
  id: string;
  title: string;
  description?: string;
  targetHours: number;
  currentHours: number;
  deadline: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  category?: string;
  priority: "low" | "medium" | "high";
};

export type GoalProgress = {
  goal: Goal;
  progressPercentage: number;
  remainingHours: number;
  daysLeft: number;
  isOnTrack: boolean;
};
