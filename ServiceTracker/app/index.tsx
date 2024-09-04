import { useState } from "react";
import {
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";

import { FirebaseError } from "@firebase/app";
import auth from "@react-native-firebase/auth";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const singUp = async () => {
    setLoading(true);

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

  const singIn = async () => {
    setLoading(true);

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
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <Button title="Sign In" onPress={singIn} disabled={loading} />
        <Button title="Sign Up" onPress={singUp} disabled={loading} />

        {loading && <ActivityIndicator size={"small"} style={{ margin: 28 }} />}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
