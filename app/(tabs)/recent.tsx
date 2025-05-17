import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useIsFocused, useScrollToTop } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ContainerStyles } from "@/constants/Styles";
import ScanHistoryEntry from "@/components/ScanHistoryEntry";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedButton } from "@/components/Button";
import { View } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { Allergies } from "@/app/(tabs)/allergies";

export default function RecentScreen() {
  const ref = useRef(null);
  const isFocused = useIsFocused();
  const { onSurfaceVariant } = useTheme();
  const [scanHistory, setScanHistory] = useState<
    { name: string; detectedAllergies: Allergies[] }[]
  >([]);

  useScrollToTop(ref);

  useEffect(() => {
    AsyncStorage.getItem("scanHistory", (error, result) => {
      if (!error && result) {
        const scanHistories = JSON.parse(result);
        setScanHistory(scanHistories);
      }
    });
  }, [isFocused]);

  const handleScanNavigationPress = () => {
    router.navigate("/");
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
      {scanHistory.length > 0 && (
        <>
          <ThemedView style={ContainerStyles.title}>
            <ThemedText type="title">Recent scans</ThemedText>
            <ThemedText>
              Review your recent food scans and their identified allergens.
            </ThemedText>
          </ThemedView>
          <ThemedView style={{ display: "flex", gap: 4 }}>
            <ThemedText type="subtitle">May 10</ThemedText>
            <ThemedView style={{ display: "flex", gap: 8 }}>
              {scanHistory.map((entry) => (
                <ScanHistoryEntry
                  key={`${entry.name}`}
                  name={entry.name}
                  detectedAllergies={entry.detectedAllergies}
                />
              ))}
            </ThemedView>
          </ThemedView>
        </>
      )}
      {scanHistory.length === 0 && (
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 40,
          }}
        >
          <MaterialIcons
            name="history-toggle-off"
            size={56}
            color={onSurfaceVariant}
          />
          <ThemedText type={"subtitle"}>Scan to unlock your history</ThemedText>
          <ThemedText style={{ textAlign: "justify" }}>
            You need to scan food items first in order to view your scan
            history.
          </ThemedText>
          <ThemedButton
            type={"small"}
            onPress={handleScanNavigationPress}
            icon="photo-camera"
          >
            Take a photo now
          </ThemedButton>
        </View>
      )}
    </ThemedScrollView>
  );
}
