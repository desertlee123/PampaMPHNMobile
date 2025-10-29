import {Text, View, Image} from "react-native"

export default function Box({title, imageUrl}){
    return (
        <View style={{backgroundColor: "#fff", borderRadius: 16}}>
            <Image source={{uri: imageUrl}} style={{width: 200, height: 200, borderTopLeftRadius: 16, borderTopRightRadius: 16}} />
            <Text style={{padding: 10}}>{title}</Text>
        </View>
    );
}