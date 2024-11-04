import { AgendaItem, Service } from "@/components/AgendaItem";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { getUpcomingService } from "@/db/services";
import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";

import {
  ColorSchemeName,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

const Home = () => {
  const colorScheme: ColorSchemeName = useColorScheme() ?? "light";
  const [upcomingService, setUpcomingService] = useState<Service | null>(null);

  const user = auth().currentUser;

  useEffect(() => {
    console.log("Getting upcoming service");
    getUpcomingService(user?.uid).then((service) => {
      if (service.length === 0) {
        setUpcomingService(null);
        return;
      }
      setUpcomingService(service[0] as Service);
    });
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={Colors[colorScheme].surfaceVariant}
      headerImage={
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles(colorScheme).logoImage}
        />
      }
    >
      <View style={styles(colorScheme).titleContainer}>
        <Text style={styles(colorScheme).title}>Welcome {user?.email}!</Text>
        <HelloWave />
      </View>

      {/* Upcoming service */}
      <View style={styles(colorScheme).stepContainer}>
        <Text style={styles(colorScheme).subtitle}>Upcoming service:</Text>

        <AgendaItem item={upcomingService} inAgenda={false} />
      </View>
    </ParallaxScrollView>
  );
};

const styles = (colorScheme: ColorSchemeName) => {
  const scheme = colorScheme ?? "light";

  return StyleSheet.create({
    container: {
      backgroundColor: Colors[scheme].background,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      lineHeight: 32,
      color: Colors[scheme].onBackground,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: Colors[scheme].onBackground,
    },
    backgroundLogo: {
      backgroundColor: Colors[scheme].primaryContainer,
    },
    logoImage: {
      width: 150,
      height: 150,
      alignSelf: "center",
      margin: 20,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
  });
};

export default Home;
