import { ThemedText } from "@/components/ThemedText";
import { useEffect, useRef, useState } from "react";
import { useIsFocused, useScrollToTop } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import { ContainerStyles } from "@/constants/Styles";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import {
  Camera,
  CameraMountError,
  PermissionResponse,
  useCameraPermissions,
} from "expo-camera";
import { AppState, Linking, View } from "react-native";
import { ThemedButton } from "@/components/ThemedButton";
import { TranslateSheet } from "@/components/TranslateSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/hooks/useTheme";
import { ScanCamera } from "@/components/ScanCamera";
import { AllergyResultSheet } from "@/components/AllergyResultSheet";
import { useMMKVBoolean } from "react-native-mmkv";
import OnboardingScreen from "@/components/onboarding/screen";

export default function HomeScreen() {
  const { onSurfaceVariant } = useTheme();
  const [hasPermission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const ref = useRef(null);
  const translateSheetRef = useRef<BottomSheetModal>(null);
  const allergyResultSheetRef = useRef<BottomSheetModal>(null);
  const [isOnboarding = true, _setIsOnboarding] =
    useMMKVBoolean("isOnboarding");
  const [cameraPermission, setCameraPermission] =
    useState<PermissionResponse | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        Camera.getCameraPermissionsAsync().then((permResponse) => {
          setCameraPermission(permResponse);
        });
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    setCameraPermission(hasPermission);
  }, [hasPermission]);

  const handleError = (error: CameraMountError) => {
    console.log(error.message);
  };

  const handleButtonPress = () => {
    translateSheetRef.current?.present();
  };

  const handlePermissionButtonPress = async () => {
    if (
      cameraPermission?.status !== "granted" &&
      cameraPermission?.canAskAgain === true
    ) {
      await requestPermission();
    } else {
      await Linking.openSettings();
    }
  };

  const handlePhoto = (photo: {
    base64: string;
    uri: string;
    height: number;
    width: number;
  }) => {
    allergyResultSheetRef.current?.present(photo);
  };

  useScrollToTop(ref);

  if (isOnboarding) {
    return <OnboardingScreen />;
  }

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
        <ThemedText type="title">Scan your food</ThemedText>
        <ThemedText type={"defaultSemiBold"}>
          Scan your food to detect potential allergens.
        </ThemedText>
      </ThemedView>
      <ThemedView style={{ flex: 1, gap: 20 }}>
        {isFocused && cameraPermission?.status === "granted" && (
          <ScanCamera onPhoto={handlePhoto} onMountError={handleError} />
        )}
        {cameraPermission?.status !== "granted" && (
          <View
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: onSurfaceVariant,
              borderRadius: 8,
              paddingHorizontal: 40,
            }}
          >
            <MaterialIcons
              name="no-photography"
              size={56}
              color={onSurfaceVariant}
            />
            <ThemedText type={"subtitle"}>Missing camera permission</ThemedText>
            <ThemedText style={{ textAlign: "justify" }}>
              Camera permissions allow an app to access and use your device’s
              camera. This is necessary for features like taking photos,
              recording videos, or scanning QR codes.
            </ThemedText>
            <ThemedButton type={"small"} onPress={handlePermissionButtonPress}>
              Request camera permission
            </ThemedButton>
          </View>
        )}
      </ThemedView>
      <ThemedView>
        <ThemedButton
          icon="question-answer"
          onPress={handleButtonPress}
          type="small"
        >
          Ask the waiter
        </ThemedButton>
      </ThemedView>
      <TranslateSheet ref={translateSheetRef} />
      <AllergyResultSheet ref={allergyResultSheetRef} />
    </ThemedScrollView>
  );
}
