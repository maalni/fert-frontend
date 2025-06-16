import { Pressable, PressableProps, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ComponentProps, PropsWithChildren } from "react";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type ButtonProps = PressableProps & {
  icon?: ComponentProps<typeof MaterialIcons>["name"];
  iconSide?: "left" | "right";
  type?: "small" | "medium";
};

export const ThemedButton = ({
  icon,
  type = "medium",
  iconSide = "left",
  style,
  children,
  disabled,
  ...otherProps
}: PropsWithChildren<ButtonProps>) => {
  const { primary, onPrimary, surfaceContainer, onSurfaceVariant } = useTheme();

  const newShade = (hexColor: string, magnitude: number) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
      const decimalColor = parseInt(hexColor, 16);
      let r = (decimalColor >> 16) + magnitude;
      r > 255 && (r = 255);
      r < 0 && (r = 0);
      let g = (decimalColor & 0x0000ff) + magnitude;
      g > 255 && (g = 255);
      g < 0 && (g = 0);
      let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
      b > 255 && (b = 255);
      b < 0 && (b = 0);
      return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
      return hexColor;
    }
  };

  return (
    <Pressable
      style={(state) => [
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        type === "small" ? ButtonStyles.small : undefined,
        type === "medium" ? ButtonStyles.medium : undefined,
        state.pressed
          ? { backgroundColor: newShade(primary, -25) }
          : {
              backgroundColor: disabled
                ? newShade(surfaceContainer, 50)
                : primary,
            },
        typeof style === "function" ? style(state) : style,
      ]}
      {...otherProps}
    >
      {icon !== undefined && iconSide === "left" && (
        <MaterialIcons
          color={disabled === true ? onSurfaceVariant : onPrimary}
          name={icon}
          size={20}
        />
      )}
      <ThemedText
        style={{
          color: disabled === true ? onSurfaceVariant : onPrimary,
        }}
      >
        {children}
      </ThemedText>
      {icon !== undefined && iconSide === "right" && (
        <MaterialIcons
          color={disabled === true ? onSurfaceVariant : onPrimary}
          name={icon}
          size={20}
        />
      )}
    </Pressable>
  );
};

const ButtonStyles = StyleSheet.create({
  small: { paddingHorizontal: 16, height: 40, gap: 8, borderRadius: 40 },
  medium: { paddingHorizontal: 24, height: 56, gap: 8, borderRadius: 56 },
});
