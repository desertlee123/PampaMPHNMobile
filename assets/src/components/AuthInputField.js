import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { darkTheme, lightTheme } from '../theme/colors';
import { useTheme } from "../theme/ThemeContext";

const AuthInputField = ({
  label,
  iconName,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style
}) => {
  const {theme} = useTheme();
  const currentStyles = styles(theme);

  return (
    <View style={[currentStyles.fieldContainer, style]}>
      <Text style={currentStyles.label}>{label}</Text>
      <View style={currentStyles.inputContainer}>
        <MaterialIcons name={iconName} size={20} color="#6B7280" style={currentStyles.icon} />
        <TextInput
          style={currentStyles.inputWithIcon}
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
}

const styles = (theme) => StyleSheet.create({
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    color: theme.text.primary,
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
    borderColor: theme.input.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: 16,
    backgroundColor: theme.input.background,
  },
});

export default AuthInputField;
