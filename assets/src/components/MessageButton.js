import { Pressable } from "react-native";
import { messageIcon } from "../../Icons";

export default function MessageButton({navigation, theme, id}){
    return (
        <Pressable 
            style={{
                backgroundColor: theme.primary,
                borderRadius: "100%",
                position: 'absolute',
                padding: 16,
                right: 14,
                bottom: 14,
            }}
            onPress={()=> {navigation.navigate("Comentarios", {id: id})}}
            >
            {messageIcon(theme.primary)}
        </Pressable>
    );
}