import { CameraMountError, CameraView } from "expo-camera";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/hooks/useTheme";
import { AllergyResultSheet } from "@/components/AllergyResultSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ThemedView } from "@/components/ThemedView";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CameraProps = {
  onMountError: (error: CameraMountError) => void;
};

type BackendResponse = {
  name: string;
  detectedAllergies: string[];
};

export const ScanCamera = ({ onMountError }: CameraProps) => {
  const ref = useRef<CameraView>(null);
  const allergyResultSheetRef = useRef<BottomSheetModal>(null);
  const { primary, onPrimary } = useTheme();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const takeImage = async () => {
    setIsWorking(true);

    if (!isCameraReady || ref.current === null) {
      setIsWorking(false);
      return;
    }

    const pic = await ref.current.takePictureAsync({
      base64: true,
    });

    if (pic === undefined || pic.base64 === undefined) {
      setIsWorking(false);
      return;
    }

    await processImage(pic.base64, pic.height, pic.width);
  };

  const pickImage = async () => {
    setIsWorking(true);
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      base64: true,
    });

    if (result.canceled || !result.assets[0].base64) {
      setIsWorking(false);
      return;
    }

    await processImage(
      result.assets[0].base64,
      result.assets[0].height,
      result.assets[0].width,
    );
  };

  const processImage = async (
    base64: string,
    height: number,
    width: number,
  ) => {
    const payload = {
      data: base64,
      height: height,
      width: width,
    };

    try {
      const settingsString = await AsyncStorage.getItem("settings");
      if (settingsString === null) {
        setIsWorking(false);
        return;
      }

      const settings = JSON.parse(settingsString);

      const url = `https://${settings.server.address}:${settings.server.port}/`;
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

      const scanHistoryString = await AsyncStorage.getItem("scanHistory");
      if (scanHistoryString === null) {
        setIsWorking(false);
        return;
      }

      const scanHistory = JSON.parse(scanHistoryString);
      await AsyncStorage.setItem(
        "scanHistory",
        JSON.stringify([
          ...scanHistory,
          {
            name: responseJson.name,
            detectedAllergies: responseJson.detectedAllergies,
          },
        ]),
      );

      allergyResultSheetRef.current?.present(responseJson);
    } catch (e) {
      console.log("Request failed", e);
    }
    setIsWorking(false);
  };

  const handleAllergyResultSheetClose = () => {
    allergyResultSheetRef.current?.dismiss();
  };

  return (
    <>
      <ThemedView
        style={{
          flex: 1,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <CameraView
          ref={ref}
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
          onCameraReady={() => setIsCameraReady(true)}
          onMountError={onMountError}
        >
          {isCameraReady && !isWorking && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                gap: 16,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                  gap: 16,
                  backgroundColor: onPrimary,
                  borderRadius: 50,
                }}
              >
                <Pressable
                  onPress={takeImage}
                  disabled={isWorking}
                  style={{
                    backgroundColor: primary,
                    borderColor: onPrimary,
                    borderWidth: 2,
                    width: 60,
                    height: 60,
                    borderRadius: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name={"photo-camera"}
                    size={24}
                    color={onPrimary}
                  />
                </Pressable>
                <ThemedText type={"defaultSemiBold"}>or</ThemedText>
                <Pressable
                  onPress={pickImage}
                  disabled={isWorking}
                  style={{
                    backgroundColor: primary,
                    borderColor: onPrimary,
                    borderWidth: 2,
                    width: 60,
                    height: 60,
                    borderRadius: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    color={onPrimary}
                    size={24}
                    name="collections"
                  />
                </Pressable>
              </View>
            </View>
          )}
          {isWorking && (
            <View
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size={56} color={primary}></ActivityIndicator>
            </View>
          )}
        </CameraView>
      </ThemedView>
      <AllergyResultSheet
        ref={allergyResultSheetRef}
        onFeedback={handleAllergyResultSheetClose}
      />
    </>
  );
};
