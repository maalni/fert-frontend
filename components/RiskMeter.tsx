import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import * as Progress from "react-native-progress";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { useMMKVObject } from "react-native-mmkv";
import { Allergy } from "@/types/Allergies";

type RiskMeterProps = {
  detectedAllergies: Allergy[];
};

export const RiskMeter = ({ detectedAllergies }: RiskMeterProps) => {
  const { green, yellow, red } = useTheme();
  const [risk, setRisk] = useState<"low" | "moderate" | "high">("low");
  const [allergies = [], _setAllergies] = useMMKVObject<string[]>("allergies");
  const [userAllergies = [], _setUserAllergies] =
    useMMKVObject<string[]>("userAllergies");

  useEffect(() => {
    const isUserAllergy = detectedAllergies.some((da) => {
      return allergies.includes(da) || userAllergies.includes(da);
    });

    switch (true) {
      case !isUserAllergy && detectedAllergies.length === 0:
        setRisk("low");
        break;
      case !isUserAllergy && detectedAllergies.length > 0:
        setRisk("moderate");
        break;
      case isUserAllergy:
        setRisk("high");
    }
  }, [allergies, detectedAllergies, userAllergies]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
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
        <ThemedText
          type={"title"}
          style={[
            risk === "low" ? { color: green } : undefined,
            risk === "moderate" ? { color: yellow } : undefined,
            risk === "high" ? { color: red } : undefined,
          ]}
        >
          Your risk is
        </ThemedText>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {risk === "low" && (
          <ThemedText style={{ color: green }}>Low</ThemedText>
        )}
        {(risk === "low" || risk === "moderate") && (
          <Progress.Bar
            progress={1}
            color={
              risk === "moderate" ? yellow : risk === "low" ? green : undefined
            }
            style={{ display: "flex", flex: 1, height: 8 }}
          />
        )}
        {risk === "moderate" && (
          <ThemedText style={{ color: yellow }}>Moderate</ThemedText>
        )}
        {(risk === "moderate" || risk === "high") && (
          <Progress.Bar
            progress={1}
            color={
              risk === "high" ? red : risk === "moderate" ? yellow : undefined
            }
            style={{ display: "flex", flex: 1, height: 8 }}
          />
        )}
        {risk === "high" && (
          <ThemedText style={{ color: red }}>High</ThemedText>
        )}
      </View>
    </View>
  );
};
