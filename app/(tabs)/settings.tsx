import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { ContainerStyles } from "@/constants/Styles";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedButton } from "@/components/Button";
import { TextInput } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useMMKV } from "react-native-mmkv/src";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { Allergies } from "@/app/(tabs)/allergies";

export default function SettingsScreen() {
  const ref = useRef(null);
  const { error, onSurfaceVariant } = useTheme();
  const [serverAddress, setServerAddress] = useMMKVString("serverAddress");
  const [serverPort, setServerPort] = useMMKVString("serverPort");
  const [scanHistory, setScanHistory] = useMMKVObject<
    {
      name: string;
      img: string;
      detectedAllergies: Allergies[];
    }[]
  >("scanHistory");
  const mmkv = useMMKV();

  useScrollToTop(ref);

  const handleClearStorageButtonPress = async () => {
    mmkv.clearAll();
  };

  const handleAddScansButtonPress = async () => {
    const temp = scanHistory !== undefined ? scanHistory : [];

    setScanHistory([
      ...temp,
      {
        name: "Bernd das Brot",
        img: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRYks8yaRJ7sIZ5x2cIt-4qJ2qdzyGOZDmGLFCShCyUpMnNGBIOjXLGKZpZdwNE_Hh1RkOqHlhDmDscUG8XUjTthOSBt1xBIf7ljBiK5Sw",
        detectedAllergies: ["wheat", "eggs", "milk"],
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
