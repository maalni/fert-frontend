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
  const { errorContainer, onErrorContainer } = useTheme();
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
      {allergies === undefined ||
        (allergies.length === 0 && (
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
        ))}
    </ThemedScrollView>
  );
}
