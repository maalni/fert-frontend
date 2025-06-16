import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { ThemedButton } from "@/components/ThemedButton";
import {
  Image,
  ImageBackground,
  Pressable,
  useColorScheme,
  View,
} from "react-native";
import { Chip } from "./Chip";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMMKVNumber, useMMKVObject } from "react-native-mmkv";
import { GoogleGenAI, Type } from "@google/genai";
import { useAssets } from "expo-asset";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { BackPressBottomSheetModal } from "@/components/BackPressBottomSheetModal";
import { ScanHistory } from "@/types/ScanHistory";
import { Allergy } from "@/types/Allergies";
import { isBackendResponse } from "@/types/BackendResponse";
import { AllergyTranslations } from "@/constants/Translations";
import { RiskMeter } from "@/components/RiskMeter";
import { Photo } from "@/types/Photo";

// eslint-disable-next-line react/display-name
export const AllergyResultSheet = forwardRef<BottomSheetModal, any>(
  (_props, ref) => {
    const {
      surfaceContainer,
      onSurfaceVariant,
      errorContainer,
      onErrorContainer,
    } = useTheme();
    const [assets, _error] = useAssets([
      require("@/assets/images/loader-light.png"),
      require("@/assets/images/loader-dark.png"),
    ]);
    const colorScheme = useColorScheme();
    const bottomSheetModal = useBottomSheetModal();
    const [allergies = [], _setAllergies] =
      useMMKVObject<string[]>("allergies");
    const [userAllergies = [], _setUserAllergies] =
      useMMKVObject<string[]>("userAllergies");
    const [scanHistory = [], setScanHistory] =
      useMMKVObject<ScanHistory[]>("scanHistory");
    const [positiveFeedback = 0, setPositiveFeedback] =
      useMMKVNumber("positiveFeedback");
    const [negativeFeedback = 0, setNegativeFeedback] =
      useMMKVNumber("negativeFeedback");
    const [detectedFood, setDetectedFood] = useState<string>("");
    const [detectedAllergies, setDetectedAllergies] = useState<Allergy[]>([]);
    const [isAccurate, setIsAccurate] = useState(true);
    const [photo, setPhoto] = useState<{
      base64: string;
      uri: string;
      height: number;
      width: number;
    }>();
    const [isWorking, setIsWorking] = useState(true);
    const [isError, setIsError] = useState(false);

    const ai = new GoogleGenAI({
      apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    });

    useEffect(() => {
      inferenceGemini();
    }, [photo]);

    const inferenceGemini = async () => {
      if (photo !== undefined) {
        setIsWorking(true);
        console.log("sending img to gemini");

        const contents = [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: photo.base64,
            },
          },
          {
            text:
              "You will receive an image of a meal. Please return only a parsable json object containing the following: " +
              "1. a string called name that contains the name of the meal as a string. " +
              "2. a string list called detectedAllergies that contains only the allergens from this exact list: milk, eggs, fish, shellfish, treeNuts, peanuts, wheat, soybeans, sesame ," +
              userAllergies.join(" ,") +
              ". Only include items from this list and nothing else. " +
              "Do not explain anything. Just output the name and the list.",
          },
        ];

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-04-17",
          contents: contents,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                },
                detectedAllergies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["name", "detectedAllergies"],
            },
          },
        });

        let parsedResponse: unknown | undefined = undefined;

        try {
          parsedResponse = JSON.parse(
            response.text !== undefined
              ? response.text
              : '{ "detectedAllergies": []; "name": "" }',
          );
        } catch (_error) {
          setIsError(true);
          setIsWorking(false);
          return;
        }

        if (isBackendResponse(parsedResponse)) {
          setDetectedAllergies(parsedResponse.detectedAllergies);
          setDetectedFood(parsedResponse.name);
        }

        setIsWorking(false);
      }
    };

    const addHistory = () => {
      if (photo !== undefined) {
        setScanHistory([
          ...scanHistory,
          {
            name: detectedFood,
            img: photo.uri,
            detectedAllergies: detectedAllergies,
            scanDate: new Date().toISOString(),
          },
        ]);
      }
    };

    const cleanupVariables = () => {
      if (!isWorking && !isError && isAccurate) {
        addHistory();
      }

      setDetectedAllergies([]);
      setDetectedFood("");
      setPhoto(undefined);
      setIsWorking(true);
      setIsError(false);
      setIsAccurate(true);
    };

    const handleClose = () => {
      bottomSheetModal.dismissAll();
    };

    const handleFeedback = (isAccurate: boolean) => {
      setIsAccurate(isAccurate);

      if (isAccurate) {
        setPositiveFeedback(positiveFeedback + 1);
      } else {
        setNegativeFeedback(negativeFeedback + 1);
      }

      bottomSheetModal.dismissAll();
    };

    let rotate = useSharedValue(0);

    //careful next line it is useDerivedValue not useSharedValue

    let iconRotate = useDerivedValue(() => {
      return interpolate(rotate.value, [0, 1], [0, 360]);
    });

    let scale = useSharedValue(0);

    let iconScale = useDerivedValue(() => {
      return interpolate(scale.value, [0, 1], [1, 1.2]);
    });

    const breathingRotationAnimation = useAnimatedStyle(() => {
      return {
        transform: [
          {
            rotate: iconRotate.value + "deg",
          },
          {
            scale: iconScale.value,
          },
        ],
      };
    });

    useEffect(() => {
      rotate.value = withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.linear }),
        -1,
        false,
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 * 4, easing: Easing.linear }),
          withTiming(0, { duration: 1000 * 4, easing: Easing.linear }),
        ),
        -1,
        false,
      );
    }, [rotate, scale]);

    return (
      <BackPressBottomSheetModal<Photo>
        ref={ref}
        style={{ backgroundColor: surfaceContainer, borderRadius: 50 }}
        handleIndicatorStyle={{ backgroundColor: onSurfaceVariant }}
        backgroundStyle={{ backgroundColor: surfaceContainer }}
        enableDismissOnClose
        onDismiss={cleanupVariables}
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
          if (data.data === undefined) {
            return null;
          }

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
                  <Pressable onPress={handleClose}>
                    <MaterialIcons
                      name="cancel"
                      size={24}
                      color={onSurfaceVariant}
                    />
                  </Pressable>
                  <Image
                    src={photo?.uri}
                    style={{
                      width: 200,
                      height: 200,
                      marginHorizontal: "auto",
                      borderRadius: 8,
                    }}
                  />
                  <RiskMeter detectedAllergies={detectedAllergies} />
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
                        {detectedAllergies.map((allergy: Allergy) => (
                          <Chip
                            key={allergy}
                            type={"normal"}
                            isSelected={
                              allergies.includes(allergy) ||
                              userAllergies.includes(allergy)
                            }
                            isSelectedViewStyle={{
                              backgroundColor: errorContainer,
                              borderColor: errorContainer,
                            }}
                            isSelectedTextStyle={{ color: onErrorContainer }}
                          >
                            {AllergyTranslations.english[allergy] !== undefined
                              ? AllergyTranslations.english[allergy]
                              : allergy}
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
                        onPress={() => handleFeedback(true)}
                      >
                        Yes
                      </ThemedButton>
                      <ThemedButton
                        type={"small"}
                        style={{ flex: 1 }}
                        icon="clear"
                        onPress={() => handleFeedback(false)}
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
                    gap: 16,
                    paddingVertical: 50,
                  }}
                >
                  <ImageBackground
                    src={photo?.uri}
                    style={{
                      width: 200,
                      height: 200,
                      marginHorizontal: "auto",
                      overflow: "hidden",
                    }}
                    imageStyle={{
                      borderRadius: 200,
                      borderWidth: 2,
                      borderColor: surfaceContainer,
                    }}
                  >
                    {assets !== undefined && (
                      <Animated.Image
                        style={[
                          {
                            width: 200,
                            height: 200,
                          },
                          breathingRotationAnimation,
                        ]}
                        source={{
                          uri:
                            colorScheme === "light"
                              ? assets[0].uri
                              : assets[1].uri,
                        }}
                      />
                    )}
                  </ImageBackground>
                  <ThemedText type={"title"}>Loading results</ThemedText>
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
                    onPress={inferenceGemini}
                  >
                    Retry
                  </ThemedButton>
                </View>
              )}
            </BottomSheetView>
          );
        }}
      </BackPressBottomSheetModal>
    );
  },
);
