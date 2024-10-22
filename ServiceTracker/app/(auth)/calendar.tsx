import { AgendaItem, Service } from "@/components/AgendaItem";
import { Colors } from "@/constants/Colors";
import { getServices } from "@/db/services";
import auth from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ColorSchemeName,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Agenda } from "react-native-calendars";

const NOW_DATE = new Date().toISOString().split("T")[0];

const CalendarScreen = () => {
  const colorScheme: ColorSchemeName = useColorScheme() ?? "light";
  const [calendarServices, setCalendarServices] = useState<Service[] | []>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const user = auth().currentUser;

  useEffect(() => {
    console.log("Getting services");
    getServices(user?.uid).then((services) => {
      setCalendarServices(services as Service[]);
    });
  }, []);

  const formatServices = (services: Service[]) => {
    let formattedServices: { [index: string]: Service[] } = {};
    services.forEach((service) => {
      let date = service.beginTime.toDate().toISOString().split("T")[0];

      if (date in formattedServices) {
        formattedServices[date].push(service);
      } else {
        formattedServices[date] = [service];
      }
    });

    // Add today as empty date
    if (!formattedServices[NOW_DATE]) {
      formattedServices[NOW_DATE] = [];
    }

    return formattedServices;
  };

  const getAgendaTheme = () => {
    return {
      // Calendar
      todayTextColor: Colors[colorScheme].primary,
      dotColor: Colors[colorScheme].primary,
      selectedDotColor: Colors[colorScheme].onPrimary,
      selectedDayBackgroundColor: Colors[colorScheme].primary,
      selectedDayTextColor: Colors[colorScheme].onPrimary,
      calendarBackground: Colors[colorScheme].surfaceVariant,
      dayTextColor: Colors[colorScheme].onSurfaceVariant,
      textSectionTitleColor: Colors[colorScheme].outline, // Week
      monthTextColor: Colors[colorScheme].onSurfaceVariant,

      // Agenda
      agendaDayTextColor: Colors[colorScheme].onBackground,
      agendaDayNumColor: Colors[colorScheme].onBackground,
      agendaTodayColor: Colors[colorScheme].primary,
      agendaKnobColor: Colors[colorScheme].inversePrimary,
      reservationsBackgroundColor: Colors[colorScheme].background,
    };
  };

  return (
    <SafeAreaView style={styles(colorScheme).container}>
      <Agenda
        key={colorScheme}
        items={formatServices(calendarServices)}
        renderItem={(item: Service) => (
          <AgendaItem item={item} inAgenda={false} />
        )}
        renderEmptyDate={() => <AgendaItem item={null} inAgenda={false} />}
        renderEmptyData={() => (
          <View style={styles(colorScheme).emptyData}>
            <Text style={{ color: Colors[colorScheme].onBackground }}>
              No services for this day
            </Text>
          </View>
        )}
        theme={getAgendaTheme()}
        showClosingKnob
      />

      <TouchableOpacity
        style={styles(colorScheme).overlayIconButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons
          name="add"
          size={40}
          color={Colors[colorScheme].onSecondary}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = (colorScheme: ColorSchemeName) => {
  const scheme = colorScheme ?? "light";

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    emptyDate: {
      height: 15,
      flex: 1,
      paddingTop: 30,
    },
    emptyData: {
      backgroundColor: Colors[scheme].background,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    overlayIconButton: {
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.2)",
      alignItems: "center",
      justifyContent: "center",
      width: 70,
      position: "absolute",
      bottom: 10,
      right: 10,
      height: 70,
      backgroundColor: Colors[scheme].secondary,
      borderRadius: 100,
    },
  });
};

export default CalendarScreen;
