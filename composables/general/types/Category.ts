export type CategoryType = {
  id: number;
  name: string;
};

export type CategoryFormType = {
  id?: number;
  name: string;
  callback?: () => void;
};
