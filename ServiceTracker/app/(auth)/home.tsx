import { Colors } from "@/constants/Colors";
import auth from "@react-native-firebase/auth";
import {
  ColorSchemeName,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

const Home = () => {
  const colorScheme: ColorSchemeName = useColorScheme() ?? "light";

  const user = auth().currentUser;
  return (
    <View style={styles(colorScheme).container}>
      <Text style={{ color: Colors[colorScheme].onBackground }}>
        Welcome {user?.email}
      </Text>
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
