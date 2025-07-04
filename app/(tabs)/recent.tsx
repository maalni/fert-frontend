import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useScrollToTop } from "@react-navigation/native";
import { useMemo, useRef } from "react";
import { ContainerStyles } from "@/constants/Styles";
import ScanHistoryEntry from "@/components/ScanHistoryEntry";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedButton } from "@/components/ThemedButton";
import { View } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useMMKVObject } from "react-native-mmkv";
import { ScanHistory } from "@/types/ScanHistory";
import { HistoryEntrySheet } from "@/components/HistoryEntrySheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function RecentScreen() {
  const ref = useRef(null);
  const historyEntrySheetRef = useRef<BottomSheetModal>(null);
  const { onSurfaceVariant } = useTheme();
  const [scanHistory = [], setScanHistory] =
    useMMKVObject<ScanHistory[]>("scanHistory");

  const groupedScanHistory = useMemo(() => {
    let temp: { [key in string]?: ScanHistory[] } = {};

    scanHistory.forEach((entry) => {
      const date = new Date(entry.scanDate).toLocaleString("en", {
        month: "long",
        day: "2-digit",
      });

      if (temp[date] === undefined) {
        temp[date] = [];
      }

      temp[date].push(entry);
    });

    return temp;
  }, [scanHistory]);

  useScrollToTop(ref);

  const handleScanNavigationPress = () => {
    router.navigate("/");
  };

  const handleDeleteButtonPress = (id: string) => {
    historyEntrySheetRef.current?.dismiss();
    setScanHistory(scanHistory.filter((entry) => entry.scanDate !== id));
  };

  const openHistorySheet = (entry: ScanHistory) => {
    historyEntrySheetRef.current?.present(entry);
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
      {Object.keys(groupedScanHistory).length > 0 && (
        <>
          <ThemedView style={ContainerStyles.title}>
            <ThemedText type="title">Recent scans</ThemedText>
            <ThemedText type={"defaultSemiBold"}>
              Review your recent food scans and their identified allergens.
            </ThemedText>
          </ThemedView>
          {Object.keys(groupedScanHistory).map((date) => (
            <ThemedView key={date} style={{ display: "flex", gap: 4 }}>
              <ThemedText type="subtitle">{date}</ThemedText>
              <View style={{ display: "flex", gap: 8 }}>
                {groupedScanHistory[date]?.map((entry) => (
                  <ScanHistoryEntry
                    key={`${entry.scanDate}-${entry.name}`}
                    name={entry.name}
                    img={entry.img}
                    detectedAllergies={entry.detectedAllergies}
                    onPress={() => openHistorySheet(entry)}
                  />
                ))}
              </View>
            </ThemedView>
          ))}
        </>
      )}
      {Object.keys(groupedScanHistory).length === 0 && (
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
            <ThemedText style={{ textAlign: "center" }}>
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
      <HistoryEntrySheet
        ref={historyEntrySheetRef}
        onDelete={handleDeleteButtonPress}
      />
    </ThemedScrollView>
  );
}
