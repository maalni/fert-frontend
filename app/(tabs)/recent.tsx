import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { ContainerStyles } from "@/constants/Styles";
import ScanHistoryEntry from "@/components/ScanHistoryEntry";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedButton } from "@/components/Button";
import { View } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { Allergies } from "@/app/(tabs)/allergies";
import { useMMKVObject } from "react-native-mmkv";

export default function RecentScreen() {
  const ref = useRef(null);
  const { onSurfaceVariant } = useTheme();
  const [scanHistory, _setScanHistory] =
    useMMKVObject<
      { name: string; img: string; detectedAllergies: Allergies[] }[]
    >("scanHistory");

  useScrollToTop(ref);

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
      {scanHistory !== undefined && scanHistory.length > 0 && (
        <>
          <ThemedView style={ContainerStyles.title}>
            <ThemedText type="title">Recent scans</ThemedText>
            <ThemedText type={"defaultSemiBold"}>
              Review your recent food scans and their identified allergens.
            </ThemedText>
          </ThemedView>
          <ThemedView style={{ display: "flex", gap: 4 }}>
            <ThemedText type="subtitle">
              {new Date().toLocaleString("en", {
                month: "long",
                day: "2-digit",
              })}
            </ThemedText>
            <ThemedView style={{ display: "flex", gap: 8 }}>
              {scanHistory.map((entry) => (
                <ScanHistoryEntry
                  key={`${entry.name}`}
                  name={entry.name}
                  img={entry.img}
                  detectedAllergies={entry.detectedAllergies}
                />
              ))}
            </ThemedView>
          </ThemedView>
        </>
      )}
      {(scanHistory === undefined || scanHistory.length === 0) && (
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            paddingHorizontal: 40,
          }}
        >
          <MaterialIcons
            name="history-toggle-off"
            size={56}
            color={onSurfaceVariant}
          />
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ThemedText type={"subtitle"}>
              Scan to unlock your history
            </ThemedText>
            <ThemedText style={{ textAlign: "justify" }}>
              You need to scan food items first in order to view your scan
              history.
            </ThemedText>
          </View>
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
