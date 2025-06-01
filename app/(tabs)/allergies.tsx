import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRef } from "react";
import { useScrollToTop } from "@react-navigation/native";
import { ContainerStyles } from "@/constants/Styles";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { View } from "react-native";
import { Chip } from "@/components/Chip";
import { useMMKVObject } from "react-native-mmkv";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Allergies, Allergy } from "@/types/Allergies";
import { AllergyTranslations } from "@/constants/Translations";

export default function AllergieScreen() {
  const ref = useRef(null);
  const { errorContainer, onErrorContainer } = useTheme();
  const [allergies = [], setAllergies] = useMMKVObject<Allergy[]>("allergies");

  useScrollToTop(ref);

  const handleAllergySelection = (
    allergy: Allergy,
    hasBeenSelected: boolean,
  ) => {
    let newAllergies: Allergy[];

    if (hasBeenSelected) {
      newAllergies = [...allergies, allergy];
    } else {
      newAllergies = allergies.filter((all) => all !== allergy);
    }

    setAllergies(newAllergies);
  };

  return (
    <ThemedScrollView
      ref={ref}
      contentContainerStyle={[
        {
          padding: 20,
          gap: 30,
          minHeight: "100%",
        },
      ]}
    >
      <ThemedView style={ContainerStyles.title}>
        <ThemedText type="title">Your allergies</ThemedText>
        <ThemedText type={"defaultSemiBold"}>
          Track and prioritize your allergies with specific highlights for
          better management.
        </ThemedText>
      </ThemedView>
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {Allergies.map((allergy) => (
          <Chip
            key={allergy}
            type={"select"}
            isSelected={allergies.includes(allergy)}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection(allergy, hasBeenSelected);
            }}
          >
            {AllergyTranslations.english[allergy]}
          </Chip>
        ))}
      </View>
      {allergies.length === 0 && (
        <View
          style={{
            backgroundColor: errorContainer,
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <MaterialIcons name={"error"} color={onErrorContainer} size={24} />
          <ThemedText style={{ color: onErrorContainer }}>
            Select at least one allergy
          </ThemedText>
        </View>
      )}
    </ThemedScrollView>
  );
}
