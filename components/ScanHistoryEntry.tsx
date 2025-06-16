import { ImageBackground } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Chip } from "@/components/Chip";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { useMMKVObject } from "react-native-mmkv";
import { Pressable, View } from "react-native";
import { AllergyTranslations } from "@/constants/Translations";
import { Allergy } from "@/types/Allergies";

type ScanHistoryEntryProps = {
  name: string;
  img: string;
  detectedAllergies: Allergy[];
  onPress: () => void;
};

export default function ScanHistoryEntry({
  name,
  img,
  detectedAllergies,
  onPress,
}: ScanHistoryEntryProps) {
  const {
    primary,
    onPrimary,
    errorContainer,
    onErrorContainer,
    onSurfaceVariant,
  } = useTheme();
  const [allergies = [], _setAllergies] = useMMKVObject<string[]>("allergies");
  const [userAllergies = [], _setUserAllergies] =
    useMMKVObject<string[]>("userAllergies");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Pressable
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
      }}
      onPress={onPress}
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
        source={{ uri: img }}
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
        <View
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
              isSelected={
                allergies.includes(allergy) || userAllergies.includes(allergy)
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
          {detectedAllergies.length === 0 && (
            <ThemedText>No allergies detected</ThemedText>
          )}
        </View>
      </ThemedView>
      <MaterialIcons name="chevron-right" size={24} color={onSurfaceVariant} />
    </Pressable>
  );
}
