import { AgendaItem, Service } from "@/components/AgendaItem";
import { addService, getServices } from "@/db/services";
import Ionicons from "@expo/vector-icons/Ionicons";
import auth from "@react-native-firebase/auth";
import { Stack } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-native-modal";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";

import ThemeContext from "@/context/ThemeContext";
import dayjs from "dayjs";
import { FirebaseError } from "firebase/app";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Agenda } from "react-native-calendars";
import Snackbar, { SnackbarAction } from "react-native-snackbar";
import { ColorScheme } from "@/constants/Colors";

const NOW_DATE = new Date().toISOString().split("T")[0];

const CalendarScreen = () => {
  const { theme } = useContext(ThemeContext);
  const user = auth().currentUser;

  const [calendarServices, setCalendarServices] = useState<Service[] | []>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [beginDatetimeModalVisible, setBeginDatetimeModalVisible] =
    useState(false);
  const [endDatetimeModalVisible, setEndDatetimeModalVisible] = useState(false);

  // Add service form inputs
  const [serviceName, setServiceName] = useState("");
  const [servicePlace, setServicePlace] = useState("");
  const [serviceBeginTime, setServiceBeginTime] = useState(new Date());
  const [serviceEndTime, setServiceEndTime] = useState(new Date());

  const updateServices = () => {
    console.log("Getting services");
    getServices(user?.uid).then((services) => {
      setCalendarServices(services as Service[]);
    });
  };

  useEffect(() => {
    updateServices();
  }, []);

  const cancelModal = () => {
    setModalVisible(false);

    // Reset form inputs
    setServiceName("");
    setServicePlace("");
    setServiceBeginTime(new Date());
    setServiceEndTime(new Date());
  };

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

  const addServiceToDB = () => {
    console.log("Adding service to db");

    if (!serviceName || !servicePlace || !serviceBeginTime || !serviceEndTime) {
      showSnackbar("Please fill all fields!", true);
      return;
    } else if (
      dayjs(serviceBeginTime).toDate() > dayjs(serviceEndTime).toDate()
    ) {
      showSnackbar("End time must be after begin time!", true);
      return;
    }

    // Add service to db
    addService(user?.uid, {
      name: serviceName,
      place: servicePlace,
      beginTime: dayjs(serviceBeginTime).toDate(),
      endTime: dayjs(serviceEndTime).toDate(),
    })
      .then(() => {
        console.log("Service added!");
        setTimeout(() => showSnackbar("Service added!"), 1500);

        // Update services
        updateServices();
      })
      .catch((e: FirebaseError) => {
        console.log("Error at adding service!" + e.message);
        setTimeout(
          () => showSnackbar("Failed to add service: " + e.message, true),
          1500
        );
      });

    cancelModal();
  };

  const showDateTimePickerModal = (
    title: String,
    isVisible: boolean,
    setDatetimeModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    date: DateType,
    setDate: React.Dispatch<React.SetStateAction<Date>>
  ) => {
    return (
      <Modal
        isVisible={isVisible}
        backdropColor={theme.scrim}
        backdropOpacity={0.6}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        <View style={styles(theme).modalView}>
          <Text style={styles(theme).modalText}>{title}</Text>
          <DateTimePicker
            mode="single"
            timePicker={true}
            date={date}
            onChange={(params) => setDate(params.date as Date)}
            headerTextStyle={{ color: theme.primary }}
            headerButtonColor={theme.onSurfaceVariant}
            calendarTextStyle={{ color: theme.onSurfaceVariant }}
            weekDaysTextStyle={{ color: theme.onSurfaceVariant }}
            selectedItemColor={theme.primary}
            timePickerTextStyle={{
              color: theme.onSurfaceVariant,
            }}
            timePickerIndicatorStyle={{
              backgroundColor: theme.primaryContainer,
            }}
          />

          <Pressable
            style={styles(theme).modalButton}
            onPress={() => setDatetimeModalVisible(false)}
          >
            <Text style={styles(theme).modalButtonText}>Save</Text>
          </Pressable>
        </View>
      </Modal>
    );
  };

  const showAddServiceModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        backdropColor={theme.scrim}
        backdropOpacity={0.6}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        <View style={styles(theme).modalView}>
          <Text style={styles(theme).modalText}>Add Service</Text>

          <Text style={styles(theme).labelText}>Name</Text>

          <View style={styles(theme).inputSection}>
            <TextInput
              style={styles(theme).input}
              value={serviceName}
              onChangeText={setServiceName}
              placeholder="Name"
              placeholderTextColor={theme.onSurface}
              autoCapitalize="none"
              cursorColor={theme.primary}
            />
          </View>

          <Text style={styles(theme).labelText}>Place</Text>

          <View style={styles(theme).inputSection}>
            <TextInput
              style={styles(theme).input}
              value={servicePlace}
              onChangeText={setServicePlace}
              placeholder="Place"
              placeholderTextColor={theme.onSurface}
              autoCapitalize="none"
              cursorColor={theme.primary}
            />
          </View>

          <Text style={[styles(theme).labelText, { marginTop: 30 }]}>
            Schedule
          </Text>
          {/* Begin DateTime */}
          <View
            style={[
              styles(theme).inputSection,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Pressable
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => setBeginDatetimeModalVisible(true)}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={theme.primary}
                style={styles(theme).inputIcon}
              />
              <Text style={styles(theme).input}>
                {serviceBeginTime
                  ? dayjs(serviceBeginTime).format("MMMM, DD, YYYY - HH:mm")
                  : "..."}
              </Text>
            </Pressable>
          </View>

          {beginDatetimeModalVisible &&
            showDateTimePickerModal(
              "Begin Time",
              beginDatetimeModalVisible,
              setBeginDatetimeModalVisible,
              serviceBeginTime,
              setServiceBeginTime
            )}

          <Text style={{ color: theme.inverseSurface }}>until</Text>

          {/* End DateTime */}
          <View style={[styles(theme).inputSection, styles(theme).timeInput]}>
            <Pressable
              style={styles(theme).timeInput}
              onPress={() => setEndDatetimeModalVisible(true)}
            >
              <Ionicons
                name="time-sharp"
                size={20}
                color={theme.primary}
                style={styles(theme).inputIcon}
              />
              <Text style={styles(theme).input}>
                {serviceEndTime
                  ? dayjs(serviceEndTime).format("MMMM, DD, YYYY - HH:mm")
                  : "..."}
              </Text>
            </Pressable>
          </View>

          {endDatetimeModalVisible &&
            showDateTimePickerModal(
              "End Time",
              endDatetimeModalVisible,
              setEndDatetimeModalVisible,
              serviceEndTime,
              setServiceEndTime
            )}

          {/* Buttons */}
          <View style={styles(theme).modalButtonsView}>
            <Pressable style={styles(theme).modalButton} onPress={cancelModal}>
              <Text style={styles(theme).modalButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={styles(theme).modalButton}
              onPress={addServiceToDB}
            >
              <Text style={styles(theme).modalButtonText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

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
      todayTextColor: theme.primary,
      dotColor: theme.primary,
      selectedDotColor: theme.onPrimary,
      selectedDayBackgroundColor: theme.primary,
      selectedDayTextColor: theme.onPrimary,
      calendarBackground: theme.surfaceVariant,
      dayTextColor: theme.onSurfaceVariant,
      textSectionTitleColor: theme.outline, // Week
      monthTextColor: theme.onSurfaceVariant,

      // Agenda
      agendaDayTextColor: theme.onBackground,
      agendaDayNumColor: theme.onBackground,
      agendaTodayColor: theme.primary,
      agendaKnobColor: theme.inversePrimary,
      reservationsBackgroundColor: theme.background,
    };
  };

  return (
    <SafeAreaView style={styles(theme).container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Ionicons
              name="refresh"
              color={theme.primary}
              size={28}
              style={{ marginRight: 10 }}
              onPress={() => {
                updateServices();
              }}
            />
          ),
        }}
      />
      <Agenda
        key={theme.primary}
        items={formatServices(calendarServices)}
        renderItem={(item: Service) => (
          <AgendaItem item={item} inAgenda={false} />
        )}
        renderEmptyDate={() => <AgendaItem item={null} inAgenda={false} />}
        renderEmptyData={() => (
          <View style={styles(theme).emptyData}>
            <Text style={{ color: theme.onBackground }}>
              No services for this day
            </Text>
          </View>
        )}
        theme={getAgendaTheme()}
        showClosingKnob
      />

      {modalVisible && showAddServiceModal()}

      <TouchableOpacity
        style={styles(theme).overlayIconButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={40} color={theme.onSecondary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = (theme: ColorScheme) => {
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
      backgroundColor: theme.background,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    overlayIconButton: {
      borderWidth: 1,
      borderColor: theme.scrim,
      alignItems: "center",
      justifyContent: "center",
      width: 70,
      position: "absolute",
      bottom: 10,
      right: 10,
      height: 70,
      backgroundColor: theme.secondary,
      borderRadius: 100,
    },
    modalView: {
      backgroundColor: theme.inverseOnSurface,
      padding: 22,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
      borderColor: theme.scrim,
    },
    modalText: {
      fontSize: 20,
      marginBottom: 12,
      color: theme.inverseSurface,
    },
    labelText: {
      color: theme.inverseSurface,
      alignSelf: "flex-start",
      marginBottom: -5,
    },
    modalButtonsView: {
      marginTop: 20,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    modalButton: {
      backgroundColor: theme.primary,
      borderRadius: 4,
      padding: 10,
      elevation: 2,
    },
    modalButtonText: {
      color: theme.onPrimary,
      fontWeight: "bold",
      textAlign: "center",
    },
    inputSection: {
      width: "100%",
      backgroundColor: theme.surfaceVariant,
      borderRadius: 10,
      elevation: 10,
      marginVertical: 10,
      height: 50,
      color: theme.primary,
    },
    input: {
      flex: 1,
      marginHorizontal: 10,
      color: theme.onSurfaceVariant,
    },
    inputIcon: {
      marginLeft: 10,
      marginRight: 5,
      color: theme.onSurfaceVariant,
    },
    timeInput: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
};

export default CalendarScreen;
