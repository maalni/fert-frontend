import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";
import { Chip } from "@/components/Chip";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { AllergyTranslations } from "@/constants/Translations";
import { Allergies, Allergy } from "@/types/Allergies";

export default function OnboardingPage2() {
  const [_isOnboarding = true, setIsOnboarding] =
    useMMKVBoolean("isOnboarding");
  const [allergies = [], setAllergies] = useMMKVObject<Allergy[]>("allergies");

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
      contentContainerStyle={{
        padding: 20,
        gap: 30,
        minHeight: "100%",
      }}
    >
      <View>
        <ThemedText type={"title"}>Select your allergens</ThemedText>
        <ThemedText type={"defaultSemiBold"}>
          Track and prioritize your allergies with specific highlights for
          better management.
        </ThemedText>
      </View>
      <View style={{ display: "flex", flex: 1 }}>
        <View
          style={{
            display: "flex",
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
      </View>
      {allergies.length === 0 && (
        <ThemedText style={{ textAlign: "center" }}>
          Select at least one allergy
        </ThemedText>
      )}
      <ThemedButton
        type={"small"}
        icon="check"
        disabled={allergies.length === 0}
        onPress={() => setIsOnboarding(false)}
      >
        Finish setup
      </ThemedButton>
    </ThemedScrollView>
  );
}
