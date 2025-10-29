import { View, Text } from 'react-native';

export default function Seccion({ children, title }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}