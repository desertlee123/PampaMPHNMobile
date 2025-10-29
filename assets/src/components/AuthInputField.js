import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lightTheme } from '../theme/colors';

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
    color: lightTheme.text.primary,
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
    borderColor: lightTheme.input.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: 16,
    backgroundColor: lightTheme.input.background,
  },
});

export default AuthInputField;
