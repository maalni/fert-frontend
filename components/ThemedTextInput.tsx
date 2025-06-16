import { TextInput, TextInputProps, ViewStyle } from "react-native";
import { PropsWithChildren } from "react";
import { useTheme } from "@/hooks/useTheme";

type ButtonProps = TextInputProps & {
  style?: ViewStyle;
};

export const ThemedTextInput = ({
  style,
  children,
  ...otherProps
}: PropsWithChildren<ButtonProps>) => {
  const { surfaceContainer, onSurfaceVariant } = useTheme();

  return (
    <TextInput
      style={[
        {
          height: 56,
          paddingHorizontal: 16,
          borderRadius: 8,
          backgroundColor: surfaceContainer,
          color: onSurfaceVariant,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </TextInput>
  );
};
