import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { ThemedButton } from "@/components/Button";
import { Pressable, View } from "react-native";
import { Chip } from "./Chip";
import * as Progress from "react-native-progress";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AllergyResultSheetProps = {
  onFeedback: (isAccurate: boolean) => void;
};

// eslint-disable-next-line react/display-name
export const AllergyResultSheet = forwardRef<
  BottomSheetModal,
  AllergyResultSheetProps
>(({ onFeedback }, ref) => {
  const { surfaceContainer, onSurfaceVariant, green, yellow, red } = useTheme();
  const bottomSheetModal = useBottomSheetModal();
  const [allergies, setAllergies] = useState<string[]>([]);
  const [detectedAllergies, setDetectedAllergies] = useState<string[]>([]);
  const [risk, setRisk] = useState<"low" | "moderate" | "high">("low");

  const updateAllergies = (index: number) => {
    if (index !== 0) {
      return;
    }

    AsyncStorage.getItem("allergies", (error, result) => {
      if (!error && result) {
        const allergies: string[] = JSON.parse(result);
        setAllergies(allergies);
      }
    });
  };

  useEffect(() => {
    let count = 0;

    detectedAllergies.forEach((da) => {
      if (allergies.includes(da)) {
        count++;
      }
    });

    switch (true) {
      case count === 0 && detectedAllergies.length === 0:
        setRisk("low");
        break;
      case count === 0 && detectedAllergies.length > 0:
        setRisk("moderate");
        break;
      case count > 0:
        setRisk("high");
    }
  }, [allergies, detectedAllergies]);

  const handleClose = () => {
    bottomSheetModal.dismissAll();
  };

  return (
    <BottomSheetModal
      ref={ref}
      style={{ backgroundColor: surfaceContainer, borderRadius: 50 }}
      handleIndicatorStyle={{ backgroundColor: onSurfaceVariant }}
      backgroundStyle={{ backgroundColor: surfaceContainer }}
      enableDismissOnClose
      onChange={updateAllergies}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...{
            appearsOnIndex: 0,
            disappearsOnIndex: -1,
            pressBehavior: "none",
            ...props,
          }}
        />
      )}
    >
      {(data) => {
        setDetectedAllergies(data.data.detectedAllergies);

        return (
          <BottomSheetView
            style={{
              padding: 20,
              paddingBottom: 50,
              gap: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText
                  type={"title"}
                  style={[
                    risk === "low" ? { color: green } : undefined,
                    risk === "moderate" ? { color: yellow } : undefined,
                    risk === "high" ? { color: red } : undefined,
                  ]}
                >
                  Your risk is
                </ThemedText>
                <Pressable onPress={handleClose}>
                  <MaterialIcons
                    name="cancel"
                    size={24}
                    color={onSurfaceVariant}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {risk === "low" && (
                  <ThemedText style={{ color: green }}>Low</ThemedText>
                )}
                {(risk === "low" || risk === "moderate") && (
                  <Progress.Bar
                    progress={1}
                    color={
                      risk === "moderate"
                        ? yellow
                        : risk === "low"
                          ? green
                          : undefined
                    }
                    style={{ display: "flex", flex: 1, height: 8 }}
                  />
                )}
                {risk === "moderate" && (
                  <ThemedText style={{ color: yellow }}>Moderate</ThemedText>
                )}
                {(risk === "moderate" || risk === "high") && (
                  <Progress.Bar
                    progress={1}
                    color={
                      risk === "high"
                        ? red
                        : risk === "moderate"
                          ? yellow
                          : undefined
                    }
                    style={{ display: "flex", flex: 1, height: 8 }}
                  />
                )}
                {risk === "high" && (
                  <ThemedText style={{ color: red }}>High</ThemedText>
                )}
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <ThemedText type="subtitle">Detected food</ThemedText>
              <ThemedText>{data.data.name}</ThemedText>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <ThemedText type="subtitle">Detected allergies</ThemedText>
              {detectedAllergies.length > 0 && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {detectedAllergies.map((allergy) => (
                    <Chip
                      key={allergy}
                      type={"normal"}
                      isSelected={allergies.includes(allergy)}
                    >
                      {allergy}
                    </Chip>
                  ))}
                </View>
              )}
              {detectedAllergies.length === 0 && (
                <ThemedText>
                  No allergies detected. Please proceed with caution
                  nevertheless!
                </ThemedText>
              )}
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",

                gap: 4,
              }}
            >
              <ThemedText type="subtitle">Is this result accurate?</ThemedText>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <ThemedButton
                  type={"small"}
                  style={{ flex: 1 }}
                  icon="check"
                  onPress={() => onFeedback(true)}
                >
                  Yes
                </ThemedButton>
                <ThemedButton
                  type={"small"}
                  style={{ flex: 1 }}
                  icon="clear"
                  onPress={() => onFeedback(false)}
                >
                  No
                </ThemedButton>
              </View>
            </View>
          </BottomSheetView>
        );
      }}
    </BottomSheetModal>
  );
});
