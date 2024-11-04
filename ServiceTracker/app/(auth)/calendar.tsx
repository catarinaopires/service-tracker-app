import { AgendaItem, Service } from "@/components/AgendaItem";
import { Colors } from "@/constants/Colors";
import { addService, getServices } from "@/db/services";
import Ionicons from "@expo/vector-icons/Ionicons";
import auth from "@react-native-firebase/auth";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";

import dayjs from "dayjs";
import { FirebaseError } from "firebase/app";
import {
  ColorSchemeName,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Agenda } from "react-native-calendars";
import Snackbar, { SnackbarAction } from "react-native-snackbar";

const NOW_DATE = new Date().toISOString().split("T")[0];

const CalendarScreen = () => {
  const colorScheme: ColorSchemeName = useColorScheme() ?? "light";
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

  const user = auth().currentUser;

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
        ? Colors[colorScheme].errorContainer
        : Colors[colorScheme].inverseSurface,
      textColor: isErrorMessage
        ? Colors[colorScheme].onErrorContainer
        : Colors[colorScheme].inverseOnSurface,
      action: action ?? {
        text: "DISMISS",
        textColor: isErrorMessage
          ? Colors[colorScheme].error
          : Colors[colorScheme].inversePrimary,
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
        backdropColor={Colors[colorScheme].scrim}
        backdropOpacity={0.6}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        <View style={styles(colorScheme).modalView}>
          <Text style={styles(colorScheme).modalText}>{title}</Text>
          <DateTimePicker
            mode="single"
            timePicker={true}
            date={date}
            onChange={(params) => setDate(params.date as Date)}
            headerTextStyle={{ color: Colors[colorScheme].primary }}
            headerButtonColor={Colors[colorScheme].onSurfaceVariant}
            calendarTextStyle={{ color: Colors[colorScheme].onSurfaceVariant }}
            weekDaysTextStyle={{ color: Colors[colorScheme].onSurfaceVariant }}
            selectedItemColor={Colors[colorScheme].primary}
            timePickerTextStyle={{
              color: Colors[colorScheme].onSurfaceVariant,
            }}
            timePickerIndicatorStyle={{
              backgroundColor: Colors[colorScheme].primaryContainer,
            }}
          />

          <Pressable
            style={styles(colorScheme).modalButton}
            onPress={() => setDatetimeModalVisible(false)}
          >
            <Text style={styles(colorScheme).modalButtonText}>Save</Text>
          </Pressable>
        </View>
      </Modal>
    );
  };

  const showAddServiceModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        backdropColor={Colors[colorScheme].scrim}
        backdropOpacity={0.6}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        <View style={styles(colorScheme).modalView}>
          <Text style={styles(colorScheme).modalText}>Add Service</Text>

          <Text style={styles(colorScheme).labelText}>Name</Text>

          <View style={styles(colorScheme).inputSection}>
            <TextInput
              style={styles(colorScheme).input}
              value={serviceName}
              onChangeText={setServiceName}
              placeholder="Name"
              placeholderTextColor={Colors[colorScheme].onSurface}
              autoCapitalize="none"
              cursorColor={Colors[colorScheme].primary}
            />
          </View>

          <Text style={styles(colorScheme).labelText}>Place</Text>

          <View style={styles(colorScheme).inputSection}>
            <TextInput
              style={styles(colorScheme).input}
              value={servicePlace}
              onChangeText={setServicePlace}
              placeholder="Place"
              placeholderTextColor={Colors[colorScheme].onSurface}
              autoCapitalize="none"
              cursorColor={Colors[colorScheme].primary}
            />
          </View>

          <Text style={[styles(colorScheme).labelText, { marginTop: 30 }]}>
            Schedule
          </Text>
          {/* Begin DateTime */}
          <View
            style={[
              styles(colorScheme).inputSection,
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
                color={Colors[colorScheme].primary}
                style={styles(colorScheme).inputIcon}
              />
              <Text style={styles(colorScheme).input}>
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

          <Text style={{ color: Colors[colorScheme].inverseSurface }}>
            until
          </Text>

          {/* End DateTime */}
          <View
            style={[
              styles(colorScheme).inputSection,
              styles(colorScheme).timeInput,
            ]}
          >
            <Pressable
              style={styles(colorScheme).timeInput}
              onPress={() => setEndDatetimeModalVisible(true)}
            >
              <Ionicons
                name="time-sharp"
                size={20}
                color={Colors[colorScheme].primary}
                style={styles(colorScheme).inputIcon}
              />
              <Text style={styles(colorScheme).input}>
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
          <View style={styles(colorScheme).modalButtonsView}>
            <Pressable
              style={styles(colorScheme).modalButton}
              onPress={cancelModal}
            >
              <Text style={styles(colorScheme).modalButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={styles(colorScheme).modalButton}
              onPress={addServiceToDB}
            >
              <Text style={styles(colorScheme).modalButtonText}>Add</Text>
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
      <Stack.Screen
        options={{
          headerRight: () => (
            <Ionicons
              name="refresh"
              color={Colors[colorScheme].primary}
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

      {modalVisible && showAddServiceModal()}

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
      borderColor: Colors[scheme].scrim,
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
    modalView: {
      backgroundColor: Colors[scheme].inverseOnSurface,
      padding: 22,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
      borderColor: Colors[scheme].scrim,
    },
    modalText: {
      fontSize: 20,
      marginBottom: 12,
      color: Colors[scheme].inverseSurface,
    },
    labelText: {
      color: Colors[scheme].inverseSurface,
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
      backgroundColor: Colors[scheme].primary,
      borderRadius: 4,
      padding: 10,
      elevation: 2,
    },
    modalButtonText: {
      color: Colors[scheme].onPrimary,
      fontWeight: "bold",
      textAlign: "center",
    },
    inputSection: {
      width: "100%",
      backgroundColor: Colors[scheme].surfaceVariant,
      borderRadius: 10,
      elevation: 10,
      marginVertical: 10,
      height: 50,
      color: Colors[scheme].primary,
    },
    input: {
      flex: 1,
      marginHorizontal: 10,
      color: Colors[scheme].onSurfaceVariant,
    },
    inputIcon: {
      marginLeft: 10,
      marginRight: 5,
      color: Colors[scheme].onSurfaceVariant,
    },
    timeInput: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
};

export default CalendarScreen;
