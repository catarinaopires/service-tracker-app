import { Colors } from "@/constants/Colors";
import ThemeContext from "@/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import auth from "@react-native-firebase/auth";
import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import Snackbar from "react-native-snackbar";

export default function TabLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tabs
      sceneContainerStyle={{ backgroundColor: theme.background }}
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.onSurfaceVariant,
        tabBarActiveBackgroundColor: theme.surfaceVariant,
        tabBarInactiveBackgroundColor: theme.surfaceVariant,
        headerTintColor: theme.onSurfaceVariant,
        headerStyle: {
          backgroundColor: theme.surfaceVariant,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerRight: () => (
            <Ionicons
              name="log-out-outline"
              color={theme.primary}
              size={28}
              style={{ marginRight: 10 }}
              onPress={() => {
                auth().signOut();
                Snackbar.show({
                  text: "Signed out!",
                  backgroundColor: theme.inverseSurface,
                  textColor: theme.inverseOnSurface,
                  action: {
                    text: "DISMISS",
                    textColor: theme.inversePrimary,
                    onPress: () => Snackbar.dismiss(),
                  },
                });
              }}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={28}
              style={styles.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          headerShown: true,
          title: "Calendar",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
              size={28}
              style={styles.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          headerShown: true,
          title: "Statistics",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              color={color}
              size={28}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});
