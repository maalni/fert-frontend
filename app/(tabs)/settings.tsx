import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { ContainerStyles } from "@/constants/Styles";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { TextInput } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useMMKV } from "react-native-mmkv/src";
import { useMMKVNumber, useMMKVObject, useMMKVString } from "react-native-mmkv";
import { ScanHistory } from "@/types/ScanHistory";

export default function SettingsScreen() {
  const ref = useRef(null);
  const { error, onSurfaceVariant } = useTheme();
  const [serverAddress = "localhost", setServerAddress] =
    useMMKVString("serverAddress");
  const [serverPort = "3000", setServerPort] = useMMKVString("serverPort");
  const [positiveFeedback = 0, _setPositiveFeedback] =
    useMMKVNumber("positiveFeedback");
  const [negativeFeedback = 0, _setNegativeFeedback] =
    useMMKVNumber("negativeFeedback");
  const [scanHistory = [], setScanHistory] =
    useMMKVObject<ScanHistory[]>("scanHistory");
  const mmkv = useMMKV();

  useScrollToTop(ref);

  const handleClearStorageButtonPress = async () => {
    mmkv.clearAll();
  };

  const handleAddScansButtonPress = async () => {
    setScanHistory([
      ...scanHistory,
      {
        name: "Bernd das Brot ...",
        img: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRYks8yaRJ7sIZ5x2cIt-4qJ2qdzyGOZDmGLFCShCyUpMnNGBIOjXLGKZpZdwNE_Hh1RkOqHlhDmDscUG8XUjTthOSBt1xBIf7ljBiK5Sw",
        detectedAllergies: ["wheat", "eggs", "milk"],
        scanDate: new Date().toISOString(),
      },
    ]);
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
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedView style={{ display: "flex", gap: 4 }}>
        <ThemedText type={"subtitle"}>Server</ThemedText>
        <TextInput
          value={serverAddress}
          onChangeText={setServerAddress}
          style={{ color: onSurfaceVariant }}
        />
        <TextInput
          inputMode={"numeric"}
          value={serverPort}
          onChangeText={setServerPort}
          style={{ color: onSurfaceVariant }}
        />
      </ThemedView>
      <ThemedView style={{ display: "flex", gap: 4 }}>
        <ThemedText type={"subtitle"}>Data</ThemedText>
        <ThemedText>
          {"positive feedback count: " + positiveFeedback}
        </ThemedText>
        <ThemedText>
          {"negative feedback count: " + negativeFeedback}
        </ThemedText>

        <ThemedButton
          style={{ flex: 1 }}
          type={"small"}
          onPress={handleAddScansButtonPress}
          icon="add"
        >
          Add scans
        </ThemedButton>
        <ThemedButton
          type={"small"}
          style={{ backgroundColor: error, flex: 1 }}
          onPress={handleClearStorageButtonPress}
          icon="delete"
        >
          Delete data
        </ThemedButton>
      </ThemedView>
    </ThemedScrollView>
  );
}
