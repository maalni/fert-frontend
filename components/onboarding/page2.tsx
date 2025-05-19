import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/Button";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";
import { Chip } from "@/components/Chip";
import { Allergies } from "@/app/(tabs)/allergies";
import { ThemedScrollView } from "@/components/ThemedScrollView";

export default function OnboardingPage2() {
  const [_, setIsOnboarding] = useMMKVBoolean("isOnboarding");
  const [allergies, setAllergies] = useMMKVObject<Allergies[]>("allergies");

  const handleAllergySelection = (
    allergy: Allergies,
    hasBeenSelected: boolean,
  ) => {
    let newAllergies: Allergies[];
    let temp = allergies !== undefined ? allergies : [];

    if (hasBeenSelected) {
      newAllergies = [...temp, allergy];
    } else {
      newAllergies = temp.filter((all) => all !== allergy);
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
          <Chip
            type={"select"}
            isSelected={allergies?.includes("milk")}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection("milk", hasBeenSelected);
            }}
          >
            Milk
          </Chip>
          <Chip
            type={"select"}
            isSelected={allergies?.includes("eggs")}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection("eggs", hasBeenSelected);
            }}
          >
            Eggs
          </Chip>
          <Chip
            type={"select"}
            isSelected={allergies?.includes("fish")}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection("fish", hasBeenSelected);
            }}
          >
            Fish
          </Chip>
          <Chip
            type={"select"}
            isSelected={allergies?.includes("shellfish")}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection("shellfish", hasBeenSelected);
            }}
          >
            Shellfish
          </Chip>
          <Chip
            type={"select"}
            isSelected={allergies?.includes("treeNuts")}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection("treeNuts", hasBeenSelected);
            }}
          >
            Tree nuts
          </Chip>
          <Chip
            type={"select"}
            isSelected={allergies?.includes("peanuts")}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection("peanuts", hasBeenSelected);
            }}
          >
            Peanuts
          </Chip>
          <Chip
            type={"select"}
            isSelected={allergies?.includes("wheat")}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection("wheat", hasBeenSelected);
            }}
          >
            Wheat
          </Chip>
          <Chip
            type={"select"}
            isSelected={allergies?.includes("soybeans")}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection("soybeans", hasBeenSelected);
            }}
          >
            Soybeans
          </Chip>
          <Chip
            type={"select"}
            isSelected={allergies?.includes("sesame")}
            onSelect={(hasBeenSelected) => {
              handleAllergySelection("sesame", hasBeenSelected);
            }}
          >
            Sesame
          </Chip>
        </View>
      </View>
      <ThemedText style={{ textAlign: "center" }}>
        Select at least one allergy
      </ThemedText>
      <ThemedButton
        type={"small"}
        icon="check"
        disabled={allergies === undefined || allergies.length === 0}
        onPress={() => setIsOnboarding(false)}
      >
        Finish setup
      </ThemedButton>
    </ThemedScrollView>
  );
}
