import { Text, type TextProps } from "react-native";
import { TextStyles } from "@/constants/Styles";
import { useTheme } from "@/hooks/useTheme";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  type = "default",
  ...otherProps
}: ThemedTextProps) {
  const { onSurfaceVariant, primary } = useTheme();

  return (
    <Text
      style={[
        { color: onSurfaceVariant },
        { fontFamily: "OpenSans_400Regular" },
        type === "default" ? TextStyles.default : undefined,
        type === "title" ? { ...TextStyles.title, color: primary } : undefined,
        type === "defaultSemiBold" ? TextStyles.defaultSemiBold : undefined,
        type === "subtitle" ? TextStyles.subtitle : undefined,
        type === "link" ? TextStyles.link : undefined,
        style,
      ]}
      {...otherProps}
    />
  );
}
