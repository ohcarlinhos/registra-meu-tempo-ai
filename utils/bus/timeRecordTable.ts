export interface TimeRecordTableBusEvent {
  action: "delete" | "edit";
  data: TimeRecordTable;
}

export const TR_TABLE_BUS_NAME = "time-record-table";
