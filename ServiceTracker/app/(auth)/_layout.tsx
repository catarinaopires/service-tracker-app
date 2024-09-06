import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import auth from "@react-native-firebase/auth";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import Snackbar from "react-native-snackbar";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].primary,
        tabBarInactiveTintColor: Colors[colorScheme].onSurface,
        tabBarActiveBackgroundColor: Colors[colorScheme].surface,
        tabBarInactiveBackgroundColor: Colors[colorScheme].surface,
        headerTintColor: Colors[colorScheme].onSurface,
        headerStyle: {
          backgroundColor: Colors[colorScheme].surface,
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
              color={Colors[colorScheme].primary}
              size={28}
              style={{ marginRight: 10 }}
              onPress={() => {
                auth().signOut();
                Snackbar.show({
                  text: "Signed out!",
                  backgroundColor: Colors[colorScheme].inverseSurface,
                  textColor: Colors[colorScheme].inverseOnSurface,
                  action: {
                    text: "DISMISS",
                    textColor: Colors[colorScheme].inversePrimary,
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
