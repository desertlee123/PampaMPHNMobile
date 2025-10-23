import { View, Pressable, Text } from "react-native";
import { SearchIcon, HomeIcon, ShortIcons, PhotoLibraryIcon, QRIcon } from '../../../../Icons';

export default function BottomBarButtom({icon, text}){
    return(
        <Pressable>
            <View style={{alignItems: "center", padding:10}}>
                <HomeIcon/>
                <Text>{text}</Text>
            </View>
        </Pressable>
    );
}