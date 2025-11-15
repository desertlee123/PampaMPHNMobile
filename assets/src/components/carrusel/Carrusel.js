// assets/src/components/carrusel/Carrusel.js
import { FlatList } from "react-native";
import CarruselElement from "./CarruselElement";
import { View } from "react-native";

const ItemSeparator = () => (
  <View style={{ width: 10 }} />
);

export default function Carrusel({ data }) {
  // console.log("Carrusel data:", data);
  return (
    <FlatList
      data={data}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => <CarruselElement title={item.nombre} imageUrl={item.imageUrl} />} z
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      ItemSeparatorComponent={ItemSeparator}
    // style={{flex: 1}}
    />
  );
}


