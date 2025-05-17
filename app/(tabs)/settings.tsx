import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useIsFocused, useScrollToTop } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ContainerStyles } from "@/constants/Styles";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedButton } from "@/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Settings = {
  server: {
    address: string;
    port: string;
  };
};

export default function SettingsScreen() {
  const ref = useRef(null);
  const { error } = useTheme();
  const isFocused = useIsFocused();
  const [serverAddress, setServerAddress] = useState("192.168.0.2");
  const [serverPort, setServerPort] = useState("3000");

  useScrollToTop(ref);

  useEffect(() => {
    AsyncStorage.getItem("settings", (error, result) => {
      if (!error && result) {
        const settings = JSON.parse(result);
        setServerAddress(settings.server.address);
        setServerPort(settings.server.port);
      }
    });
  }, [isFocused]);

  const handleClearStorageButtonPress = async () => {
    await AsyncStorage.clear();
  };

  const handleSaveStorageButtonPress = async () => {
    const settings: Settings = {
      server: {
        address: serverAddress,
        port: serverPort,
      },
    };

    await AsyncStorage.setItem("settings", JSON.stringify(settings));
  };

  const handleAddScansButtonPress = async () => {
    await AsyncStorage.setItem(
      "scanHistory",
      JSON.stringify([
        { name: "Spaghetti", detectedAllergies: ["fish", "test2"] },
      ]),
    );
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
        <TextInput value={serverAddress} onChangeText={setServerAddress} />
        <TextInput inputMode={"numeric"} value={serverPort} />
      </ThemedView>
      <ThemedView style={{ display: "flex", gap: 4 }}>
        <ThemedText type={"subtitle"}>Data</ThemedText>
        <View
          style={{
            display: "flex",
            gap: 8,
            flexDirection: "row",
          }}
        >
          <ThemedButton
            style={{ flex: 1 }}
            type={"small"}
            onPress={handleSaveStorageButtonPress}
            icon="save"
          >
            Save settings
          </ThemedButton>
          <ThemedButton
            type={"small"}
            style={{ backgroundColor: error, flex: 1 }}
            onPress={handleClearStorageButtonPress}
            icon="delete"
          >
            Delete data
          </ThemedButton>
        </View>
        <ThemedButton
          style={{ flex: 1 }}
          type={"small"}
          onPress={handleAddScansButtonPress}
          icon="add"
        >
          Add scans
        </ThemedButton>
      </ThemedView>
    </ThemedScrollView>
  );
}
