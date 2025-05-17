import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

export function ThemedSafeAreaView({
  style,
  ...otherProps
}: SafeAreaViewProps) {
  const { surface } = useTheme();

  return (
    <SafeAreaView
      style={[{ backgroundColor: surface }, style]}
      {...otherProps}
    />
  );
}
