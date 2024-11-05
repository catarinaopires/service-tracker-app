import { AgendaItem, Service } from "@/components/AgendaItem";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ColorScheme } from "@/constants/Colors";
import ThemeContext from "@/context/ThemeContext";
import { getUpcomingService } from "@/db/services";
import auth from "@react-native-firebase/auth";
import { useCallback, useContext, useEffect, useState } from "react";

import { Image, RefreshControl, StyleSheet, Text, View } from "react-native";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const user = auth().currentUser;

  const [upcomingService, setUpcomingService] = useState<Service | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const updateUpcomingService = () => {
    console.log("Getting upcoming service");
    getUpcomingService(user?.uid).then((service) => {
      if (service.length === 0) {
        setUpcomingService(null);
        return;
      }
      setUpcomingService(service[0] as Service);
      setRefreshing(false);
    });
  };

  useEffect(() => {
    updateUpcomingService();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateUpcomingService();
  }, []);

  return (
    <ParallaxScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      headerBackgroundColor={theme.surfaceVariant}
      headerImage={
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles(theme).logoImage}
        />
      }
    >
      <View style={styles(theme).titleContainer}>
        <Text style={styles(theme).title}>Welcome {user?.email}!</Text>
        <HelloWave />
      </View>

      {/* Upcoming service */}
      <View style={styles(theme).stepContainer}>
        <Text style={styles(theme).subtitle}>Upcoming service:</Text>

        <AgendaItem item={upcomingService} inAgenda={false} />
      </View>
    </ParallaxScrollView>
  );
};

const styles = (theme: ColorScheme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      lineHeight: 32,
      color: theme.onBackground,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.onBackground,
    },
    backgroundLogo: {
      backgroundColor: theme.primaryContainer,
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
