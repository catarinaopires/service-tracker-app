import { View, Text, Button, StyleSheet, useColorScheme, ColorSchemeName } from "react-native";
import auth from "@react-native-firebase/auth";
import { Colors } from "@/constants/Colors";

const Home = () => {
  const colorScheme: ColorSchemeName = useColorScheme() ?? "light";
  
  const user = auth().currentUser;
  return (
    <View style={styles(colorScheme).container}>
      <Text>Welcome {user?.email}</Text>
    </View>
  );
};

const styles = (colorScheme: ColorSchemeName) => {
  const scheme = colorScheme ?? "light";

  return StyleSheet.create({
  container: {
    backgroundColor: Colors[scheme].background,
  },
});
};

export default Home;
