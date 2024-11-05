import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Snackbar, { SnackbarAction } from "react-native-snackbar";

import Ionicons from "@expo/vector-icons/Ionicons";

import { ColorScheme } from "@/constants/Colors";
import ThemeContext from "@/context/ThemeContext";
import { FirebaseError } from "@firebase/app";
import auth from "@react-native-firebase/auth";

export default function Index() {
  const { theme } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showSnackbar = (
    message: string,
    isErrorMessage: boolean = false,
    action?: SnackbarAction
  ) => {
    return Snackbar.show({
      text: message,
      backgroundColor: isErrorMessage
        ? theme.errorContainer
        : theme.inverseSurface,
      textColor: isErrorMessage
        ? theme.onErrorContainer
        : theme.inverseOnSurface,
      action: action ?? {
        text: "DISMISS",
        textColor: isErrorMessage ? theme.error : theme.inversePrimary,
        onPress: () => Snackbar.dismiss(),
      },
    });
  };

  const withEmptyFields = () => {
    if (!email || !password) {
      showSnackbar("Please fill in all fields.", true);
      return true;
    }
    return false;
  };

  const signUp = async () => {
    setLoading(true);

    if (withEmptyFields()) {
      setLoading(false);
      return;
    }

    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        showSnackbar("User account created & signed in!");
      })
      .catch((e) => {
        const error = e as FirebaseError;
        showSnackbar("Registration failed: " + error.message, true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signIn = async () => {
    setLoading(true);

    if (withEmptyFields()) {
      setLoading(false);
      return;
    }

    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        showSnackbar("User signed in!");
      })
      .catch((e) => {
        const error = e as FirebaseError;
        showSnackbar("Sign in failed: " + error.message, true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView
      style={styles(theme).container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles(theme).backgroundLogo}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles(theme).logoImage}
        />
      </View>

      <View style={styles(theme).bottomView}>
        <Text style={styles(theme).title}>Welcome!</Text>

        <View style={styles(theme).bottomViewContent}>
          <KeyboardAvoidingView behavior="padding">
            {/* Input form fields */}
            <View style={styles(theme).inputSection}>
              <Ionicons
                name="person"
                size={20}
                style={styles(theme).inputIcon}
              />
              <TextInput
                style={styles(theme).input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={theme.onSurface}
                keyboardType="email-address"
                autoCapitalize="none"
                cursorColor={theme.primaryContainer}
              />
            </View>

            <View style={styles(theme).inputSection}>
              <Ionicons
                name="lock-closed"
                size={20}
                style={styles(theme).inputIcon}
              />
              <TextInput
                style={styles(theme).input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={theme.onSurface}
                secureTextEntry
                cursorColor={theme.primaryContainer}
              />
            </View>

            {/* Buttons */}
            <View style={styles(theme).bottomViewContent}>
              <Pressable
                style={styles(theme).button}
                onPress={signIn}
                disabled={loading}
              >
                <Text style={styles(theme).buttonText}>Sign In</Text>
              </Pressable>

              <Pressable
                style={styles(theme).button}
                onPress={signUp}
                disabled={loading}
              >
                <Text style={styles(theme).buttonText}>Sign Up</Text>
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

const styles = (theme: ColorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 34,
      fontWeight: "bold",
      lineHeight: 32,
      alignSelf: "center",
      color: theme.onBackground,
    },
    backgroundLogo: {
      backgroundColor: theme.primaryContainer,
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
      backgroundColor: theme.background,
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
      backgroundColor: theme.surfaceVariant,
      borderRadius: 10,
      elevation: 10,
      marginVertical: 10,
      alignItems: "center",
      height: 50,
      color: theme.onSurfaceVariant,
    },
    inputIcon: {
      marginLeft: 10,
      marginRight: 5,
      color: theme.onSurfaceVariant,
    },
    input: {
      flex: 1,
      color: theme.onSurfaceVariant,
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
      backgroundColor: theme.primaryContainer,
      color: theme.onPrimaryContainer,
    },
    buttonText: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: "bold",
      letterSpacing: 0.25,
      color: theme.onSurface,
    },
  });
};
