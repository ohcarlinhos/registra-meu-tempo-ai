export const isDark = computed(() => {
  const html = document.querySelector("html");
  return !!html?.classList.contains("dark");
});

