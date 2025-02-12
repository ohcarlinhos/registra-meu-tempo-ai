export const isVerifiedPage = (name: string) => {
  return ["verify.page.code", "verify.page"].includes(name);
};

export const updateTimeRecordPageBreadcrumb = (title?: string) => {
  useConfigStore().setBreadcrumbPage([
    { label: "Tarefas", pageName: "record.panel" },
    { label: title || "Sem título" },
  ]);
};
