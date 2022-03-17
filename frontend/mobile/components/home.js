import { Button, Text, View } from "react-native";

function PingHome({navigation}) {
    return (  
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text>Home</Text>
            <Button title="To Streams" onPress={()=>navigation.navigate('Streams')}/>
        </View>
    );
}

export default PingHome;