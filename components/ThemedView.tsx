import { View, type ViewProps } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export function ThemedView({ style, ...otherProps }: ViewProps) {
  const { surface } = useTheme();

  return <View style={[{ backgroundColor: surface }, style]} {...otherProps} />;
}
