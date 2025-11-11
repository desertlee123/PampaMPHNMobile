import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function Seccion({ children, title }) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: theme.text.primary }}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}