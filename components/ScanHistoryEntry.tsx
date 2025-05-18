import { ImageBackground } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "react-native";
import { Chip } from "@/components/Chip";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { useMMKVObject } from "react-native-mmkv";

type ScanHistoryEntryProps = {
  name: string;
  img: string;
  detectedAllergies: string[];
};

export default function ScanHistoryEntry({
  name,
  img,
  detectedAllergies,
}: ScanHistoryEntryProps) {
  const { primary, onPrimary } = useTheme();
  const [allergies, _] = useMMKVObject<string[]>("allergies");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Pressable
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
      }}
    >
      <ImageBackground
        style={{
          width: 100,
          height: 100,
          backgroundColor: primary,
          borderRadius: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
        source={img}
        onLoad={() => setIsImageLoaded(true)}
      >
        {!isImageLoaded && (
          <MaterialIcons name="photo-camera" size={48} color={onPrimary} />
        )}
      </ImageBackground>
      <ThemedView
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <ThemedText type="subtitle">{name}</ThemedText>
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {detectedAllergies.map((allergy) => (
            <Chip
              key={allergy}
              type={"normal"}
              isSelected={allergies?.includes(allergy)}
            >
              {allergy}
            </Chip>
          ))}
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}
