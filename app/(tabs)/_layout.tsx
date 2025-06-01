import { Tabs } from "expo-router";
import React, { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useMMKVBoolean } from "react-native-mmkv";

export default function TabLayout() {
  const { surfaceContainer, onSurfaceVariant, secondaryContainer } = useTheme();
  const [isOnboarding = true, _setIsOnboarding] =
    useMMKVBoolean("isOnboarding");

  const renderButton = (props: BottomTabBarButtonProps) => {
    return (
      <Pressable
        style={{
          gap: 4,
          paddingTop: 12,
          paddingBottom: 12,
          minHeight: 80,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={props.onPress}
      >
        {props.children}
      </Pressable>
    );
  };

  const renderTabBarIcon = (
    props: {
      focused: boolean;
    },
    icon: ComponentProps<typeof MaterialIcons>["name"],
  ) => {
    return (
      <View
        style={[
          {
            height: 32,
            width: 64,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 16,
          },
          props.focused ? { backgroundColor: secondaryContainer } : undefined,
        ]}
      >
        <MaterialIcons name={icon} color={onSurfaceVariant} size={24} />
      </View>
    );
  };

  const renderLabel = (props: { children: string }) => {
    return (
      <ThemedText type={"default"} style={{ fontSize: 12 }}>
        {props.children}
      </ThemedText>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarButton: renderButton,
        tabBarLabel: renderLabel,
        tabBarActiveBackgroundColor: surfaceContainer,
        tabBarInactiveBackgroundColor: surfaceContainer,
        tabBarActiveTintColor: onSurfaceVariant,
        tabBarInactiveTintColor: onSurfaceVariant,
        headerShown: false,
      }}
      tabBar={isOnboarding ? () => null : undefined}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: (props) => renderTabBarIcon(props, "photo-camera"),
        }}
      />
      <Tabs.Screen
        name="recent"
        options={{
          title: "Recent",
          tabBarIcon: (props) => renderTabBarIcon(props, "schedule"),
        }}
      />
      <Tabs.Screen
        name="allergies"
        options={{
          title: "Your Allergies",
          tabBarIcon: (props) => renderTabBarIcon(props, "medical-information"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: (props) => renderTabBarIcon(props, "bug-report"),
        }}
      />
    </Tabs>
  );
}
