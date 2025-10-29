import { FlatList } from "react-native";
import CarruselElement from "./CarruselElement";
import { CarruselData } from "../../../datos de prueba/CarruselData";
import { View } from "react-native";

export default function Carrusel() {
  return (
    <FlatList
        data={CarruselData}
        renderItem={({item}) => <CarruselElement title={item.title} imageUrl={item.imageUrl} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        // style={{flex: 1}}
    />
  );
}