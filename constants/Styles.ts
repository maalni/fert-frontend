import { StyleSheet } from "react-native";

export const ContainerStyles = StyleSheet.create({
  title: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
});

export const TextStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "OpenSans_600SemiBold",
  },
  title: {
    fontSize: 32,
    lineHeight: 42,
    fontFamily: "OpenSans_700Bold",
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "OpenSans_700Bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
