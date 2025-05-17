import { ScrollView, ScrollViewProps } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
export const ThemedScrollView = forwardRef<ScrollView, ScrollViewProps>(
  ({ style, ...otherProps }, ref) => {
    const { surface } = useTheme();

    return (
      <ScrollView
        ref={ref}
        style={[{ backgroundColor: surface }, style]}
        {...otherProps}
      />
    );
  },
);
