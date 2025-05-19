import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { ThemedButton } from "@/components/Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ContainerStyles } from "@/constants/Styles";

type OnboardingPage1Props = {
  onPage: () => void;
};

export default function OnboardingPage1({ onPage }: OnboardingPage1Props) {
  const { primary, onSurfaceVariant } = useTheme();

  return (
    <ThemedScrollView
      contentContainerStyle={{
        display: "flex",
        flex: 1,
        padding: 20,
        gap: 30,
        minHeight: "100%",
      }}
    >
      <View style={{ display: "flex", alignItems: "center" }}>
        <View
          style={{
            display: "flex",
            width: 200,
            height: 200,
            borderRadius: 200,
            backgroundColor: primary,
          }}
        />
      </View>
      <View style={ContainerStyles.title}>
        <ThemedText type={"title"} style={{}}>
          Food allergy scanner
        </ThemedText>
      </View>
      <View style={{ display: "flex", flex: 1, gap: 32 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <MaterialIcons
            name="lunch-dining"
            size={42}
            color={onSurfaceVariant}
          />
          <View style={{ display: "flex", flex: 1, gap: 4 }}>
            <ThemedText type={"subtitle"}>Screen food for allergies</ThemedText>
            <ThemedText>
              Take pictures of your meals to track ingredients and identify
              potential allergens.
            </ThemedText>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <MaterialIcons
            name="question-answer"
            size={42}
            color={onSurfaceVariant}
          />
          <View style={{ display: "flex", flex: 1, gap: 4 }}>
            <ThemedText type={"subtitle"}>
              Ask the waiter in their native language
            </ThemedText>
            <ThemedText>
              Speak to the server in their first language for clarity. Use the
              translation feature to communicate.
            </ThemedText>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <MaterialIcons name="schedule" size={42} color={onSurfaceVariant} />
          <View style={{ display: "flex", flex: 1, gap: 4 }}>
            <ThemedText type={"subtitle"}>
              Keep track of which food you’ve eaten
            </ThemedText>
            <ThemedText>
              Record meals to monitor consumption. Note ingredients to avoid
              repetition or reactions.
            </ThemedText>
          </View>
        </View>
      </View>
      <ThemedButton type={"small"} onPress={onPage}>
        Continue
      </ThemedButton>
    </ThemedScrollView>
  );
}
