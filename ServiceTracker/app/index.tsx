import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { FirebaseError } from "@firebase/app";
import auth from "@react-native-firebase/auth";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const withEmptyFields = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
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
      style={{ flex: 1, backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ backgroundColor: "#909ff5" }}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logoImage}
        />
      </View>

      <View style={styles.bottomView}>
        <View style={{ padding: 50 }}>
          <Text style={{ fontSize: 34, alignSelf: "center" }}>Welcome!</Text>

          <View style={{ marginTop: 20 }}>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.inputSection}>
                <Ionicons name="person" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputSection}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry
                />
              </View>

              <Pressable
                style={styles.button}
                onPress={signIn}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </Pressable>

              <Pressable
                style={styles.button}
                onPress={signUp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </Pressable>

              {loading && (
                <ActivityIndicator size={"small"} style={{ margin: 28 }} />
              )}
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
    margin: 80,
  },
  bottomView: {
    flex: 1.5,
    marginTop: -40,
    backgroundColor: "#fff",
    bottom: 20,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
  inputSection: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10,
    marginVertical: 10,
    alignItems: "center",
    height: 50,
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  input: {
    flex: 1,
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
    backgroundColor: "#909ff5",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
