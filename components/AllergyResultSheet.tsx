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
import { ActivityIndicator, Pressable, View } from "react-native";
import { Chip } from "./Chip";
import * as Progress from "react-native-progress";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";

type AllergyResultSheetProps = {
  onFeedback: (isAccurate: boolean) => void;
};

type BackendResponse = {
  name: string;
  detectedAllergies: string[];
};

// eslint-disable-next-line react/display-name
export const AllergyResultSheet = forwardRef<
  BottomSheetModal,
  AllergyResultSheetProps
>(({ onFeedback }, ref) => {
  const { surfaceContainer, onSurfaceVariant, green, yellow, red, primary } =
    useTheme();
  const bottomSheetModal = useBottomSheetModal();
  const [serverAddress, _n] = useMMKVString("serverAddress");
  const [serverPort, _s] = useMMKVString("serverPort");
  const [allergies, _a] = useMMKVObject<string[]>("allergies");
  const [scanHistory, setScanHistory] =
    useMMKVObject<{ name: string; img: string; detectedAllergies: string[] }[]>(
      "scanHistory",
    );
  const [detectedFood, setDetectedFood] = useState<string>("");
  const [detectedAllergies, setDetectedAllergies] = useState<string[]>([]);
  const [photo, setPhoto] = useState<{
    base64: string;
    uri: string;
    height: number;
    width: number;
  }>();
  const [risk, setRisk] = useState<"low" | "moderate" | "high">("low");
  const [isWorking, setIsWorking] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    processImage();
  }, [photo]);

  useEffect(() => {
    let count = 0;

    detectedAllergies.forEach((da) => {
      if (allergies?.includes(da)) {
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

  const processImage = async () => {
    if (photo !== undefined) {
      setIsError(false);
      setIsWorking(true);

      const payload = {
        data: photo.base64,
        height: photo.height,
        width: photo.width,
      };

      try {
        const url = `https://${serverAddress}:${serverPort}/`;
        console.log("Sending image to: " + url);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const responseJson = (await response.json()) as BackendResponse;

        const temp = scanHistory !== undefined ? scanHistory : [];

        setScanHistory([
          ...temp,
          {
            name: responseJson.name,
            img: photo.uri,
            detectedAllergies: responseJson.detectedAllergies,
          },
        ]);

        setDetectedAllergies(responseJson.detectedAllergies);
        setDetectedFood(responseJson.name);
      } catch (e) {
        console.log("Request failed", e);
        setIsError(true);
      }
      setIsWorking(false);
    }
  };

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
        setPhoto(data.data);

        return (
          <BottomSheetView
            style={{
              padding: 20,
              paddingBottom: 50,
              gap: 20,
            }}
          >
            {!isWorking && !isError && (
              <>
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
                      <ThemedText style={{ color: yellow }}>
                        Moderate
                      </ThemedText>
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
                  <ThemedText>{detectedFood}</ThemedText>
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
                          isSelected={allergies?.includes(allergy)}
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
                  <ThemedText type="subtitle">
                    Is this result accurate?
                  </ThemedText>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 8 }}
                  >
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
              </>
            )}
            {isWorking && (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <ActivityIndicator size={56} color={primary} />
                <ThemedText type={"subtitle"}>Loading results</ThemedText>
              </View>
            )}
            {isError && (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <MaterialIcons
                  name="error"
                  size={56}
                  color={onSurfaceVariant}
                />
                <ThemedText type={"subtitle"}>An error occurred</ThemedText>
                <ThemedButton
                  type={"small"}
                  icon="refresh"
                  onPress={processImage}
                >
                  Retry
                </ThemedButton>
              </View>
            )}
          </BottomSheetView>
        );
      }}
    </BottomSheetModal>
  );
});
