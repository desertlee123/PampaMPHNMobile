import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const AuthInputField = ({
  label,
  iconName,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style
}) => (
  <View style={[styles.fieldContainer, style]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <MaterialIcons name={iconName} size={20} color="#6B7280" style={styles.icon} />
      <TextInput
        style={styles.inputWithIcon}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    color: "#111827",
    fontSize: 14,
    marginBottom: 4
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
});

export default AuthInputField;
