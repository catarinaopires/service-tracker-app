import Ionicons from "@expo/vector-icons/Ionicons";
import { Timestamp } from "firebase/firestore";
import { isEmpty, isNull } from "lodash";
import React, { useCallback } from "react";

import { Colors } from "@/constants/Colors";
import {
  Alert,
  ColorSchemeName,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

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

  const colorScheme: ColorSchemeName = useColorScheme() ?? "light";

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
      <View style={styles(colorScheme).emptyItem}>
        <Text style={styles(colorScheme).emptyItemText}>No Service</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={itemPressed}
      style={styles(colorScheme).item}
      testID={"item"}
    >
      <View>
        <Text style={styles(colorScheme).itemTitleTextUpcoming}>
          {item.name}
        </Text>

        <View style={styles(colorScheme).icons}>
          <Ionicons
            name="calendar-clear-outline"
            size={16}
            color={Colors[colorScheme].primary}
          />
          <Text style={styles(colorScheme).itemHourText}>
            {item.beginTime.toDate().toDateString()}
          </Text>
        </View>
        <View style={styles(colorScheme).icons}>
          <Ionicons
            name="location-outline"
            size={16}
            color={Colors[colorScheme].primary}
          />
          <Text style={styles(colorScheme).itemHourText}>{item.place}</Text>
        </View>
        <View style={styles(colorScheme).icons}>
          <Ionicons
            name="time-outline"
            size={16}
            color={Colors[colorScheme].primary}
          />
          <Text style={styles(colorScheme).itemDurationText}>
            {getTime(item.beginTime)} - {getTime(item.endTime)}
          </Text>
        </View>
      </View>

      {/* <View style={styles(colorScheme).itemButtonContainer}>
        <Button color={Colors[colorScheme].secondary} title={'Info'}/>
      </View> */}
    </TouchableOpacity>
  );
};

const styles = (colorScheme: ColorSchemeName) => {
  const scheme = colorScheme ?? "light";

  console.log("scheme: ", scheme);
  console.log("Colors: ", Colors[scheme]);

  return StyleSheet.create({
    item: {
      padding: 20,
      backgroundColor: Colors[scheme].elevation.level2,
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
      color: Colors[scheme].onSurface,
      paddingLeft: 4,
    },
    itemDurationTextUpcoming: {
      color: "grey",
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    itemTitleTextUpcoming: {
      color: Colors[scheme].onSurface,
      marginLeft: 4,
      marginBottom: 10,
      fontWeight: "bold",
      fontSize: 18,
    },
    itemDurationText: {
      color: Colors[scheme].onSurfaceVariant,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    itemTitleText: {
      color: Colors[scheme].onSurface,
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
      borderBottomColor: Colors[scheme].outline,
    },
    emptyItemText: {
      color: Colors[scheme].outline,
      fontSize: 14,
    },
  });
};

export { AgendaItem, Service };

