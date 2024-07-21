const colorMode = useColorMode();

export const isDark = computed(() => {
  return colorMode && colorMode.value === "dark";
});

export const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
