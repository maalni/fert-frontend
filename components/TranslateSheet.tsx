import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Pressable, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { Allergies } from "@/app/(tabs)/allergies";
import { ThemedButton } from "@/components/Button";
import { router } from "expo-router";
import { AllergyTranslations } from "@/constants/Translations";
import { useMMKVObject } from "react-native-mmkv";

// eslint-disable-next-line react/display-name
export const TranslateSheet = forwardRef<BottomSheetModal, {}>((_, ref) => {
  const { surfaceContainer, onSurfaceVariant } = useTheme();
  const bottomSheetModal = useBottomSheetModal();
  const [allergies, _s] = useMMKVObject<Allergies[]>("allergies");
  const [targetLanguage, setTargetLanguage] = useState<
    "chinese" | "korean" | "german"
  >("chinese");

  const handleClose = () => {
    bottomSheetModal.dismissAll();
  };

  const handlePress = () => {
    bottomSheetModal.dismissAll();
    router.navigate("/allergies");
  };

  return (
    <BottomSheetModal
      ref={ref}
      style={{ backgroundColor: surfaceContainer, borderRadius: 50 }}
      handleIndicatorStyle={{ backgroundColor: onSurfaceVariant }}
      backgroundStyle={{ backgroundColor: surfaceContainer }}
      enableDismissOnClose
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
      <BottomSheetView
        style={{
          padding: 20,
          paddingBottom: 50,
          gap: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText type={"title"}>Ask the waiter</ThemedText>
          <Pressable onPress={handleClose}>
            <MaterialIcons name="cancel" size={24} color={onSurfaceVariant} />
          </Pressable>
        </View>
        {allergies !== undefined && allergies.length > 0 && (
          <>
            <Picker
              mode={"dropdown"}
              onValueChange={setTargetLanguage}
              selectedValue={targetLanguage}
            >
              <Picker.Item label="Korean" value="korean" />
              <Picker.Item label="Chinese" value="chinese" />
              <Picker.Item label="German" value="german" />
            </Picker>
            <ThemedText>
              {AllergyTranslations[targetLanguage].start}
              {allergies?.map((allergy, index) => {
                return (
                  AllergyTranslations[targetLanguage][allergy] +
                  (allergies.length - 2 > index ? ", " : "") +
                  (allergies.length - 2 === index
                    ? AllergyTranslations[targetLanguage].or
                    : "")
                );
              })}
              {AllergyTranslations[targetLanguage].end}
            </ThemedText>
          </>
        )}
        {(allergies === undefined || allergies.length === 0) && (
          <>
            <ThemedText>No allergies selected</ThemedText>
            <ThemedButton type={"small"} onPress={handlePress}>
              To allergies page
            </ThemedButton>
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});
