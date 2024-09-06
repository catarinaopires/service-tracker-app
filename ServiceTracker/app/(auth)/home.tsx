import { AgendaItem, Service } from "@/components/AgendaItem";
import { Colors } from "@/constants/Colors";
import { getUpcomingService } from "@/db/services";
import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import {
  ColorSchemeName,
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
    getUpcomingService(user?.uid).then((service) => {
      if (service.length === 0) {
        setUpcomingService(null);
        return;
      }
      setUpcomingService(service[0] as Service);
    });
  }, []);

  return (
    <View style={styles(colorScheme).container}>
      <Text style={{ color: Colors[colorScheme].onBackground }}>
        Welcome {user?.email}
      </Text>

      <Text style={{ color: Colors[colorScheme].onBackground }}>
        Upcoming service:
      </Text>

      <AgendaItem item={upcomingService} inAgenda={false} />
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
