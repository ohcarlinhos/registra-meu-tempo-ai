export interface TimeRecordTableBusEvent {
  action: "delete" | "edit" | "access";
  data: TimeRecordTable;
}

export const TR_TABLE_BUS_NAME = "time-record-table";
