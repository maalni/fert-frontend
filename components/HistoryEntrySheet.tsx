import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Image, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { BackPressBottomSheetModal } from "@/components/BackPressBottomSheetModal";
import { Allergy } from "@/types/Allergies";
import { ThemedText } from "@/components/ThemedText";
import { Chip } from "@/components/Chip";
import { AllergyTranslations } from "@/constants/Translations";
import { ScanHistory } from "@/types/ScanHistory";
import { ThemedButton } from "@/components/ThemedButton";

type HistoryEntrySheetProps = {
  onDelete: (id: string) => void;
};

// eslint-disable-next-line react/display-name
export const HistoryEntrySheet = forwardRef<
  BottomSheetModal,
  HistoryEntrySheetProps
>(({ onDelete }, ref) => {
  const {
    surfaceContainer,
    onSurfaceVariant,
    errorContainer,
    onErrorContainer,
    error,
  } = useTheme();
  const [allergies = [], _setAllergies] = useMMKVObject<Allergy[]>("allergies");
  const [userAllergies = [], _setUserAllergies] =
    useMMKVObject<string[]>("userAllergies");

  const handleOnDelete = (id?: string) => {
    if (id !== undefined) {
      onDelete(id);
    }
  };

  return (
    <BackPressBottomSheetModal<ScanHistory>
      ref={ref}
      style={{ backgroundColor: surfaceContainer, borderRadius: 50 }}
      handleIndicatorStyle={{ backgroundColor: onSurfaceVariant }}
      backgroundStyle={{ backgroundColor: surfaceContainer }}
      enableDismissOnClose
      stackBehavior={"push"}
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

        return (
          <BottomSheetView
            style={{
              padding: 20,
              paddingBottom: 50,
              gap: 20,
            }}
          >
            <Image
              source={{ uri: data.data?.img }}
              style={{
                width: 200,
                height: 200,
                marginHorizontal: "auto",
                borderRadius: 8,
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <ThemedText type="subtitle">Detected food</ThemedText>
              <ThemedText>{data.data?.name}</ThemedText>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <ThemedText type="subtitle">Detected allergies</ThemedText>
              {data.data.detectedAllergies.length > 0 && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {data.data.detectedAllergies.map((allergy: Allergy) => (
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
              {data.data.detectedAllergies.length === 0 && (
                <ThemedText>
                  No allergies detected. Please proceed with caution
                  nevertheless!
                </ThemedText>
              )}
            </View>
            <ThemedButton
              type={"small"}
              icon={"delete"}
              style={{ backgroundColor: error }}
              onPress={() => handleOnDelete(data.data?.scanDate)}
            >
              Delete entry
            </ThemedButton>
          </BottomSheetView>
        );
      }}
    </BackPressBottomSheetModal>
  );
});
