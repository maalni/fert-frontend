import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRef } from "react";
import { useScrollToTop } from "@react-navigation/native";
import { ContainerStyles } from "@/constants/Styles";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { View } from "react-native";
import { Chip } from "@/components/Chip";
import { useMMKVObject } from "react-native-mmkv";

export type Allergies =
  | "milk"
  | "eggs"
  | "fish"
  | "shellfish"
  | "treeNuts"
  | "peanuts"
  | "wheat"
  | "soybeans"
  | "sesame";

export default function AllergieScreen() {
  const ref = useRef(null);
  const [allergies, setAllergies] = useMMKVObject<Allergies[]>("allergies");

  useScrollToTop(ref);

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
        <ThemedText>
          Track and prioritize your allergies with specific highlights for
          better management.
        </ThemedText>
      </ThemedView>
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
    </ThemedScrollView>
  );
}
