import { Pressable, PressableProps, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ComponentProps, PropsWithChildren } from "react";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type ButtonProps = PressableProps & {
  icon?: ComponentProps<typeof MaterialIcons>["name"];
  type?: "small" | "medium";
  style?: ViewStyle;
};

export const ThemedButton = ({
  icon,
  type = "medium",
  style,
  children,
  ...otherProps
}: PropsWithChildren<ButtonProps>) => {
  const { primary, onPrimary, surfaceContainer, onSurfaceVariant } = useTheme();

  return (
    <Pressable
      style={[
        {
          backgroundColor:
            otherProps.disabled === true ? surfaceContainer : primary,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        type === "small" ? ButtonStyles.small : undefined,
        type === "medium" ? ButtonStyles.medium : undefined,
        style,
      ]}
      {...otherProps}
    >
      {icon !== undefined && (
        <MaterialIcons
          color={otherProps.disabled === true ? onSurfaceVariant : onPrimary}
          name={icon}
          size={20}
        />
      )}
      <ThemedText
        style={{
          color: otherProps.disabled === true ? onSurfaceVariant : onPrimary,
        }}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
};

const ButtonStyles = StyleSheet.create({
  small: { paddingHorizontal: 16, height: 40, gap: 8, borderRadius: 40 },
  medium: { paddingHorizontal: 24, height: 56, gap: 8, borderRadius: 56 },
});
