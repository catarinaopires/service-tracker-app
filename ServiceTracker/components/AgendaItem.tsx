import Ionicons from "@expo/vector-icons/Ionicons";
import { Timestamp } from "firebase/firestore";
import { isEmpty, isNull } from "lodash";
import React, { useCallback, useContext } from "react";

import ThemeContext from "@/context/ThemeContext";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ColorScheme } from "@/constants/Colors";

type Service = {
  name: string;
  place: string;
  date: string;
  beginTime: Timestamp;
  endTime: Timestamp;
};

interface ItemProps {
  item: Service | null;
  inAgenda: boolean;
}

const AgendaItem = (props: ItemProps) => {
  const { item } = props;

  const { theme } = useContext(ThemeContext);

  const itemPressed = useCallback(() => {
    if (isNull(item) || isEmpty(item)) {
      return;
    }
    Alert.alert(item.name, `Place: ${item.place}`);
  }, []);

  const getTime = (time: Timestamp) => {
    return `${time.toDate().getHours()}h${
      time.toDate().getMinutes() < 10
        ? "0" + time.toDate().getMinutes()
        : time.toDate().getMinutes()
    }`;
  };

  if (isNull(item) || isEmpty(item)) {
    return (
      <View style={styles(theme).emptyItem}>
        <Text style={styles(theme).emptyItemText}>No Service</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={itemPressed}
      style={styles(theme).item}
      testID={"item"}
    >
      <View>
        <Text style={styles(theme).itemTitleTextUpcoming}>{item.name}</Text>

        <View style={styles(theme).icons}>
          <Ionicons
            name="calendar-clear-outline"
            size={16}
            color={theme.primary}
          />
          <Text style={styles(theme).itemHourText}>
            {item.beginTime.toDate().toDateString()}
          </Text>
        </View>
        <View style={styles(theme).icons}>
          <Ionicons name="location-outline" size={16} color={theme.primary} />
          <Text style={styles(theme).itemHourText}>{item.place}</Text>
        </View>
        <View style={styles(theme).icons}>
          <Ionicons name="time-outline" size={16} color={theme.primary} />
          <Text style={styles(theme).itemDurationText}>
            {getTime(item.beginTime)} - {getTime(item.endTime)}
          </Text>
        </View>
      </View>

      {/* <View style={styles(theme).itemButtonContainer}>
        <Button color={theme.secondary} title={'Info'}/>
      </View> */}
    </TouchableOpacity>
  );
};

const styles = (theme: ColorScheme) => {
  return StyleSheet.create({
    item: {
      padding: 20,
      backgroundColor: theme.elevation.level2,
      flexDirection: "row",
      borderRadius: 10,
      margin: 10,
    },
    icons: {
      marginLeft: 20,
      flexDirection: "row",
      alignItems: "center",
    },
    itemHourText: {
      fontSize: 15,
      color: theme.onSurface,
      paddingLeft: 4,
    },
    itemDurationTextUpcoming: {
      color: "grey",
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    itemTitleTextUpcoming: {
      color: theme.onSurface,
      marginLeft: 4,
      marginBottom: 10,
      fontWeight: "bold",
      fontSize: 18,
    },
    itemDurationText: {
      color: theme.onSurfaceVariant,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    itemTitleText: {
      color: theme.onSurface,
      marginLeft: 16,
      fontWeight: "bold",
      fontSize: 16,
    },
    itemButtonContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    emptyItem: {
      paddingLeft: 20,
      height: 52,
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.outline,
    },
    emptyItemText: {
      color: theme.outline,
      fontSize: 14,
    },
  });
};

export { AgendaItem, Service };
