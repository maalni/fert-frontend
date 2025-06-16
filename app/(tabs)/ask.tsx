import { useMemo, useRef, useState } from "react";
import { useScrollToTop } from "@react-navigation/native";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { useMMKVObject } from "react-native-mmkv";
import { useTheme } from "@/hooks/useTheme";
import { Allergy } from "@/types/Allergies";
import { ContainerStyles } from "@/constants/Styles";
import { ThemedText } from "@/components/ThemedText";
import { Pressable, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AllergyTranslations, Languages } from "@/constants/Translations";
import { ThemedButton } from "@/components/ThemedButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TranslationResultSheet } from "@/components/TranslationResultSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function AskScreen() {
  const ref = useRef(null);
  const resultSheetRef = useRef<BottomSheetModal>(null);
  const pickerRef = useRef<Picker<Languages>>(null);
  const { primary, onSurfaceVariant } = useTheme();
  const [allergies = [], _setAllergies] = useMMKVObject<Allergy[]>("allergies");
  const [userAllergies = [], _setUserAllergies] =
    useMMKVObject<string[]>("userAllergies");
  const [targetLanguage, setTargetLanguage] = useState<Languages>(undefined);

  useScrollToTop(ref);

  const openResultSheet = (containsAllergy: boolean) => {
    resultSheetRef.current?.present(containsAllergy);
  };

  const openPicker = () => {
    pickerRef.current?.focus();
  };

  const allergyStringTranslated = useMemo(() => {
    if (targetLanguage !== undefined) {
      return allergies.map((allergy, index) => {
        return (
          AllergyTranslations[targetLanguage][allergy] +
          (allergies.length - 2 > index ? ", " : "") +
          (allergies.length - 2 === index
            ? AllergyTranslations[targetLanguage].or
            : "")
        );
      });
    }
    return [];
  }, [allergies, targetLanguage]);

  const allergyStringEnglish = useMemo(() => {
    return allergies.map((allergy, index) => {
      return (
        AllergyTranslations.english[allergy] +
        (allergies.length - 2 > index ? ", " : "") +
        (allergies.length - 2 === index ? AllergyTranslations.english.or : "")
      );
    });
  }, [allergies]);

  return (
    <ThemedScrollView
      ref={ref}
      contentContainerStyle={[
        {
          padding: 20,
          gap: 50,
        },
      ]}
    >
      {allergies.length + userAllergies.length > 0 && (
        <>
          {targetLanguage !== undefined ? (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                transform: "rotate(180deg)",
              }}
            >
              <ThemedText type="subtitle">
                {AllergyTranslations[targetLanguage].start}
                {allergyStringTranslated}
                {AllergyTranslations[targetLanguage].end}
              </ThemedText>
              <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <ThemedButton
                  type={"small"}
                  style={{ flex: 1 }}
                  onPress={() => openResultSheet(true)}
                >
                  {AllergyTranslations[targetLanguage].yes}
                </ThemedButton>
                <ThemedButton
                  type={"small"}
                  style={{ flex: 1 }}
                  onPress={() => openResultSheet(false)}
                >
                  {AllergyTranslations[targetLanguage].no}
                </ThemedButton>
              </View>
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="translate"
                color={onSurfaceVariant}
                size={24}
              />
              <ThemedText>The translation will appear here.</ThemedText>
            </View>
          )}

          <View
            style={{
              display: "flex",
              backgroundColor: onSurfaceVariant,
              height: 4,
              borderRadius: 4,
            }}
          />

          <View style={ContainerStyles.title}>
            <ThemedText type="title">Ask the waiter in</ThemedText>
            <Pressable
              onPress={openPicker}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ThemedText
                type={"title"}
                style={{ textDecorationLine: "underline" }}
              >
                {targetLanguage !== undefined
                  ? targetLanguage
                  : "               "}
              </ThemedText>
              <ThemedText>
                <MaterialIcons name="expand-more" size={24} color={primary} />
              </ThemedText>
            </Pressable>
          </View>

          <View>
            <ThemedText>
              This feature asks the following sentence to the waiter in their
              native language: ”Does this food contain {allergyStringEnglish}?”
            </ThemedText>
            <ThemedText>
              The waiter is then able to provide a simple yes, no answer.
            </ThemedText>
          </View>
          <Picker
            ref={pickerRef}
            mode={"dialog"}
            onValueChange={setTargetLanguage}
            selectedValue={targetLanguage}
            dropdownIconColor={primary}
            style={{ display: "none" }}
          >
            <Picker.Item label="Chinese" value="chinese" />
            <Picker.Item label="French" value="french" />
            <Picker.Item label="German" value="german" />
            <Picker.Item label="Hindi" value="hindi" />
            <Picker.Item label="Japanese" value="japanese" />
            <Picker.Item label="Korean" value="korean" />
          </Picker>
        </>
      )}
      <TranslationResultSheet ref={resultSheetRef} />
    </ThemedScrollView>
  );
}
