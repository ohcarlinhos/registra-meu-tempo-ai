export interface CategoryTableBusEvent {
  action: "delete" | "edit";
  data: CategoryMap;
}

export const CATEGORY_TABLE_BUS_NAME = "category-table";
