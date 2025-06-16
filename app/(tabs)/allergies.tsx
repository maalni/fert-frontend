import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRef, useState } from "react";
import { useScrollToTop } from "@react-navigation/native";
import { ContainerStyles } from "@/constants/Styles";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Chip } from "@/components/Chip";
import { useMMKVObject } from "react-native-mmkv";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Allergies, Allergy } from "@/types/Allergies";
import { AllergyTranslations } from "@/constants/Translations";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function AllergieScreen() {
  const ref = useRef(null);
  const { errorContainer, onErrorContainer, onSurfaceVariant } = useTheme();
  const [allergies = [], setAllergies] = useMMKVObject<Allergy[]>("allergies");
  const [userAllergies = [], setUserAllergies] =
    useMMKVObject<string[]>("userAllergies");

  const [temp, setTemp] = useState("");

  useScrollToTop(ref);

  const handleAllergySelection = (
    allergy: Allergy,
    hasBeenSelected: boolean,
  ) => {
    let newAllergies: Allergy[];

    if (hasBeenSelected) {
      newAllergies = [...allergies, allergy];
    } else {
      newAllergies = allergies.filter((all) => all !== allergy);
    }

    setAllergies(newAllergies);
  };

  const handleUserAllergySelection = (
    allergy: string,
    hasBeenSelected: boolean,
  ) => {
    if (allergy === "") {
      return;
    }

    let newUserAllergies: string[];

    if (hasBeenSelected) {
      newUserAllergies = [...userAllergies, allergy];
    } else {
      newUserAllergies = userAllergies.filter((all) => all !== allergy);
    }

    setUserAllergies(newUserAllergies);

    setTemp("");
  };

  const insets = 0;
  const headerHeight = 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={headerHeight + insets}
    >
      <ThemedScrollView
        ref={ref}
        contentContainerStyle={[
          {
            padding: 20,
            gap: 30,
          },
        ]}
      >
        <ThemedView style={ContainerStyles.title}>
          <ThemedText type="title">Your allergies</ThemedText>
          <ThemedText type={"defaultSemiBold"}>
            Track and prioritize your allergies with specific highlights for
            better management.
          </ThemedText>
        </ThemedView>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <ThemedText type={"defaultSemiBold"}>Common allergies:</ThemedText>
          <View
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {Allergies.map((allergy) => (
              <Chip
                key={allergy}
                type={"select"}
                isSelected={allergies.includes(allergy)}
                onSelect={(hasBeenSelected) => {
                  handleAllergySelection(allergy, hasBeenSelected);
                }}
              >
                {AllergyTranslations.english[allergy]}
              </Chip>
            ))}
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {userAllergies.length > 0 && (
            <>
              <ThemedText type={"defaultSemiBold"}>
                Personally defined allergies:
              </ThemedText>
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "row",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {userAllergies.map((allergy) => (
                  <Chip
                    key={allergy}
                    type={"select"}
                    isSelected={true}
                    onSelect={(hasBeenSelected) => {
                      handleUserAllergySelection(allergy, hasBeenSelected);
                    }}
                  >
                    {allergy}
                  </Chip>
                ))}
              </View>
            </>
          )}
          {userAllergies.length === 0 && (
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
                name="favorite"
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
                  Add your personal allergies
                </ThemedText>
                <ThemedText style={{ textAlign: "center" }}>
                  Enter your personal allergies to ensure they’re taken into
                  account.
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      </ThemedScrollView>
      <ThemedView
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 8,
          padding: 20,
        }}
      >
        {allergies.length + userAllergies.length === 0 && (
          <View
            style={{
              backgroundColor: errorContainer,
              paddingVertical: 12,
              paddingHorizontal: 8,
              borderRadius: 8,
              display: "flex",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <MaterialIcons name={"error"} color={onErrorContainer} size={24} />
            <ThemedText style={{ color: onErrorContainer }}>
              Select or add at least one allergy
            </ThemedText>
          </View>
        )}
        <ThemedTextInput
          value={temp}
          onChangeText={setTemp}
          placeholder={"Type your allergy here..."}
          submitBehavior={"submit"}
          onSubmitEditing={(a) =>
            handleUserAllergySelection(a.nativeEvent.text, true)
          }
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
