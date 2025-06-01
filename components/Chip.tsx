import { ThemedText } from "@/components/ThemedText";
import { Pressable, TextStyle, ViewStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps, PropsWithChildren } from "react";
import { useTheme } from "@/hooks/useTheme";

type ChipProps = {
  icon?: ComponentProps<typeof MaterialIcons>["name"];
  type: "normal" | "select";
  isSelected?: boolean;
  onSelect?: (value: boolean) => void;
  isSelectedViewStyle?: ViewStyle;
  isSelectedTextStyle?: TextStyle;
};

export const Chip = ({
  icon,
  type = "normal",
  onSelect,
  children,
  isSelected,
  isSelectedViewStyle,
  isSelectedTextStyle,
}: PropsWithChildren<ChipProps>) => {
  const { outlineVariant, onSurfaceVariant, secondaryContainer } = useTheme();

  const handlePress = () => {
    if (type === "select") {
      onSelect?.(!Boolean(isSelected));
    }
  };

  return (
    <Pressable
      style={[
        {
          display: "flex",
          flexDirection: "row",
          borderWidth: 1,
          borderRadius: 8,
          borderColor: isSelected ? secondaryContainer : outlineVariant,
          paddingHorizontal: 16,
          height: 32,
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isSelected ? secondaryContainer : undefined,
        },
        isSelectedViewStyle !== undefined && isSelected
          ? isSelectedViewStyle
          : undefined,
      ]}
      onPress={handlePress}
    >
      {type === "normal" && icon !== undefined && (
        <MaterialIcons color={onSurfaceVariant} name={icon} size={18} />
      )}
      {type === "select" && isSelected === true && (
        <MaterialIcons color={onSurfaceVariant} name="check" size={18} />
      )}
      <ThemedText style={isSelectedTextStyle}>{children}</ThemedText>
    </Pressable>
  );
};
