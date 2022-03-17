import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PingHome from "../home";
import PingStream from "../streams";
// import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Feather } from "@expo/vector-icons"
import { Text } from "react-native";
import PingAdd from "../add";

const Tab = createBottomTabNavigator()

function PingTab() {
    return (  
        <Tab.Navigator 
            screenOptions={
                    {
                        headerStyle:{
                            backgroundColor:"#f1B684",  
                        },
                        tabBarStyle:{
                            backgroundColor:"#f1B684",  
                            position:"absolute",
                            bottom:25,
                            left:20,
                            right:20,
                            borderRadius:100,
                            height:80,
                            elevation:0,
                            paddingTop:20
                        },
                       tabBarShowLabel:false
                        // tabBarLabel:false
                    }
            }
            
          >
        <Tab.Screen name="Home" component={PingHome} options={
            {
                tabBarIcon: ({focused})=> (
                    <>
                    <Feather name="home" size={30} color="black"/>
                    <Text>Home</Text>
                    </>
                )
            }
        }/>
        <Tab.Screen name="Add" component={PingAdd} options={
                {
                  tabBarIcon: ({focused})=> (
                      <>
                        <Feather name="plus-circle" size={30} color="black"/>
                      </>
                  )
                }
        }/>
        <Tab.Screen name="Streams" component={PingStream}  options={
            {
                tabBarIcon: ({focused})=> (
                    <>
                        <Feather name="list" size={30} color="black"/>
                        <Text>Streams</Text>
                    </>
                )
            }
        }/>
    </Tab.Navigator>
    );
}

export default PingTab;