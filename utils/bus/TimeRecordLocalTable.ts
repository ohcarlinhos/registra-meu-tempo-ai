export interface TimeRecordLocalTableBusEvent {
  action: "delete" | "sync" | "bind" | "createFrom";
  data: TimeRecordLocalTable;
}

export const TRL_TABLE_BUS_NAME = "time-record-local-table";
