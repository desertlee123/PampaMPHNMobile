import { FlatList } from "react-native";
import CarruselElement from "./CarruselElement";
import { CarruselData } from "../../../datos de prueba/CarruselData";
import { View } from "react-native";

export default function Carrusel() {
  return (
    <FlatList
        data={CarruselData}
        renderItem={({item}) => <CarruselElement title={item.title} imageUrl={getImage4Url(item.imageUrl)} />} //getBase64FromUrl.then(base64 => <CarruselElement title={item.title} imageUrl={'data:image/jpg;base64,' + base64} />)}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        // style={{flex: 1}}
    />
  );
}

const getBase64FromUrl = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  };

async function getImage4Url(imageURl) {
  try{
    const image = getBase64FromUrl(imageURl);
    console.log(image);
    return image;
    
  }
  catch(e){
    console.log(e);
  }
}


