import { FlatList } from "react-native";
import CarruselElement from "./CarruselElement";
import { CarruselData } from "../../../datos de prueba/CarruselData";
import { View } from "react-native";

export default function Carrusel({data}) {
  console.log("Carrusel data:", data);
  return (
    <FlatList
        data={data}
        renderItem={({item}) => <CarruselElement title={item.nombre} imageUrl={item.imageUrl} />}z
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        // style={{flex: 1}}
    />
  );
}


