import React, { useState } from "react";
import {
  ActivityIndicator,
  ColorSchemeName,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "@/constants/Colors";
import { FirebaseError } from "@firebase/app";
import auth from "@react-native-firebase/auth";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const colorScheme: ColorSchemeName = useColorScheme() ?? "light";

  const withEmptyFields = () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return true;
    }
    return false;
  };

  const signUp = async () => {
    setLoading(true);

    if (withEmptyFields()) return;

    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log("User account created & signed in!");
      })
      .catch((e) => {
        const error = e as FirebaseError;
        alert("Registration failed: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signIn = async () => {
    setLoading(true);

    if (withEmptyFields()) return;

    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("User signed in!");
      })
      .catch((e) => {
        const error = e as FirebaseError;
        alert("Sign in failed: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView
      style={styles(colorScheme).container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles(colorScheme).backgroundLogo}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles(colorScheme).logoImage}
        />
      </View>

      <View style={styles(colorScheme).bottomView}>
        <Text style={styles(colorScheme).title}>Welcome!</Text>

        <View style={styles(colorScheme).bottomViewContent}>
          <KeyboardAvoidingView behavior="padding">
            {/* Input form fields */}
            <View style={styles(colorScheme).inputSection}>
              <Ionicons
                name="person"
                size={20}
                style={styles(colorScheme).inputIcon}
              />
              <TextInput
                style={styles(colorScheme).input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={Colors[colorScheme].onSurface}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles(colorScheme).inputSection}>
              <Ionicons
                name="lock-closed"
                size={20}
                style={styles(colorScheme).inputIcon}
              />
              <TextInput
                style={styles(colorScheme).input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={Colors[colorScheme].onSurface}
                secureTextEntry
              />
            </View>

            {/* Buttons */}
            <View style={styles(colorScheme).bottomViewContent}>
              <Pressable
                style={styles(colorScheme).button}
                onPress={signIn}
                disabled={loading}
              >
                <Text style={styles(colorScheme).buttonText}>Sign In</Text>
              </Pressable>

              <Pressable
                style={styles(colorScheme).button}
                onPress={signUp}
                disabled={loading}
              >
                <Text style={styles(colorScheme).buttonText}>Sign Up</Text>
              </Pressable>
            </View>

            {loading && (
              <ActivityIndicator size={"small"} style={{ margin: 28 }} />
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = (colorScheme: ColorSchemeName) => {
  const scheme = colorScheme ?? "light";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[scheme].background,
    },
    title: {
      fontSize: 34,
      fontWeight: "bold",
      lineHeight: 32,
      alignSelf: "center",
      color: Colors[scheme].onBackground,
    },
    backgroundLogo: {
      backgroundColor: Colors[scheme].primaryContainer,
    },
    logoImage: {
      width: 200,
      height: 200,
      alignSelf: "center",
      margin: 80,
    },
    bottomView: {
      flex: 1.5,
      marginTop: -40,
      backgroundColor: Colors[scheme].background,
      bottom: 20,
      borderTopStartRadius: 60,
      borderTopEndRadius: 60,
      padding: 50,
    },
    bottomViewContent: {
      marginTop: 20,
    },
    inputSection: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: Colors[scheme].surfaceVariant,
      borderRadius: 10,
      elevation: 10,
      marginVertical: 10,
      alignItems: "center",
      height: 50,
      color: Colors[scheme].onSurfaceVariant,
    },
    inputIcon: {
      marginLeft: 10,
      marginRight: 5,
      color: Colors[scheme].onSurfaceVariant,
    },
    input: {
      flex: 1,
      color: Colors[scheme].onSurfaceVariant,
    },
    button: {
      marginTop: 15,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 10,
      height: 50,
      alignItems: "center",
      alignSelf: "stretch",
      elevation: 3,
      backgroundColor: Colors[scheme].primaryContainer,
      color: Colors[scheme].onPrimaryContainer,
    },
    buttonText: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: "bold",
      letterSpacing: 0.25,
      color: Colors[scheme].onSurface,
    },
  });
};
