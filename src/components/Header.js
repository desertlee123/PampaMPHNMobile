import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({children , navigation, theme}) {
  return (
    <View 
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: theme.cardBackground,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" ,alignItems: "center", gap: 16}}>
            {children}
        </View>
      </View>
  );
}