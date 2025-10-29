import { View, Text, Image } from "react-native";

export default function CarruselElement({title, imageUrl}) {
    return (
        <View>
            <View style={{position: 'relative', display: 'inline-block'}}>
                <Image source={{uri: imageUrl}} style={{width: 379, height: 200, marginBottom: 8, borderRadius: 16}} />
                <Text style={{position: 'absolute', top: 10, left: 10}}>{title}</Text>
            </View>
            <View style={{width: 10, height: 10}}/>
        </View>
    );
}


