import { CameraMountError, CameraView } from "expo-camera";
import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/hooks/useTheme";
import { ThemedView } from "@/components/ThemedView";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";

type CameraProps = {
  onPhoto: (photo: {
    base64: string;
    uri: string;
    height: number;
    width: number;
  }) => void;
  onMountError: (error: CameraMountError) => void;
};

export const ScanCamera = ({ onPhoto, onMountError }: CameraProps) => {
  const ref = useRef<CameraView>(null);

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

    onPhoto({
      base64: pic.base64,
      uri: pic.uri,
      height: pic.height,
      width: pic.width,
    });
    setIsWorking(false);
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

    onPhoto({
      base64: result.assets[0].base64,
      uri: result.assets[0].uri,
      height: result.assets[0].height,
      width: result.assets[0].width,
    });
    setIsWorking(false);
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
          {isCameraReady && (
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
        </CameraView>
      </ThemedView>
    </>
  );
};
