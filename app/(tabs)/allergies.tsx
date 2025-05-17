import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useRef, useState } from "react";
import { useIsFocused, useScrollToTop } from "@react-navigation/native";
import { ContainerStyles } from "@/constants/Styles";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { View } from "react-native";
import { Chip } from "@/components/Chip";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const isFocused = useIsFocused();
  const [allergies, setAllergies] = useState<Allergies[]>([]);

  useScrollToTop(ref);

  useEffect(() => {
    AsyncStorage.getItem("allergies", (error, result) => {
      if (!error && result) {
        const allergies: Allergies[] = JSON.parse(result);
        setAllergies(allergies);
      }
    });
  }, [isFocused]);

  const handleAllergySelection = (
    allergy: Allergies,
    hasBeenSelected: boolean,
  ) => {
    let newAA: Allergies[];

    if (hasBeenSelected) {
      newAA = [...allergies, allergy];
    } else {
      newAA = allergies.filter((all) => all !== allergy);
    }

    AsyncStorage.setItem("allergies", JSON.stringify(newAA), (error) => {
      if (!error) {
        setAllergies(newAA);
      }
    });
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
          isSelected={allergies.includes("milk")}
          onSelect={(hasBeenSelected) => {
            handleAllergySelection("milk", hasBeenSelected);
          }}
        >
          Milk
        </Chip>
        <Chip
          type={"select"}
          isSelected={allergies.includes("eggs")}
          onSelect={(hasBeenSelected) => {
            handleAllergySelection("eggs", hasBeenSelected);
          }}
        >
          Eggs
        </Chip>
        <Chip
          type={"select"}
          isSelected={allergies.includes("fish")}
          onSelect={(hasBeenSelected) => {
            handleAllergySelection("fish", hasBeenSelected);
          }}
        >
          Fish
        </Chip>
        <Chip
          type={"select"}
          isSelected={allergies.includes("shellfish")}
          onSelect={(hasBeenSelected) => {
            handleAllergySelection("shellfish", hasBeenSelected);
          }}
        >
          Shellfish
        </Chip>
        <Chip
          type={"select"}
          isSelected={allergies.includes("treeNuts")}
          onSelect={(hasBeenSelected) => {
            handleAllergySelection("treeNuts", hasBeenSelected);
          }}
        >
          Tree nuts
        </Chip>
        <Chip
          type={"select"}
          isSelected={allergies.includes("peanuts")}
          onSelect={(hasBeenSelected) => {
            handleAllergySelection("peanuts", hasBeenSelected);
          }}
        >
          Peanuts
        </Chip>
        <Chip
          type={"select"}
          isSelected={allergies.includes("wheat")}
          onSelect={(hasBeenSelected) => {
            handleAllergySelection("wheat", hasBeenSelected);
          }}
        >
          Wheat
        </Chip>
        <Chip
          type={"select"}
          isSelected={allergies.includes("soybeans")}
          onSelect={(hasBeenSelected) => {
            handleAllergySelection("soybeans", hasBeenSelected);
          }}
        >
          Soybeans
        </Chip>
        <Chip
          type={"select"}
          isSelected={allergies.includes("sesame")}
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
