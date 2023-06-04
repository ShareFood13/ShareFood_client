import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Dimensions
} from 'react-native'
import React, { useState } from 'react'
import GlobalStyles from '../GlobalStyles'
import { useDispatch } from 'react-redux';
import { startFollowing } from '../Redux/actions/auth';
import { useFonts } from 'expo-font';
import {
    Roboto_400Regular,
    Lato_400Regular,
    Montserrat_400Regular,
    Oswald_400Regular,
    SourceCodePro_400Regular,
    Slabo27px_400Regular,
    Poppins_400Regular,
    Lora_400Regular,
    Rubik_400Regular,
    PTSans_400Regular,
    Karla_400Regular
} from '@expo-google-fonts/dev';
import GlobalFontStyles from '../GlobalFontStyles';
import trans from '../Language'

const UserHomeCard = ({ user, navigation, userId }) => {
    const [language, setLanguage] = useState("en")
    const [theme, setTheme] = useState("stylesLight")
    const [fontStyle, setFontStyle] = useState("Montserrat")
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Lato_400Regular,
        Montserrat_400Regular,
        // Oswald_400Regular,
        // SourceCodePro_400Regular,
        Slabo27px_400Regular,
        Poppins_400Regular,
        Lora_400Regular,
        Rubik_400Regular,
        PTSans_400Regular,
        Karla_400Regular
    })
    const dispatch = useDispatch()


    const openOtherUser = (userInfo) => {
        navigation.navigate("ShowOtherUser", { userInfo })
    }

    const startFollowingFn = (follow_id) => {
        dispatch(startFollowing({ userId, follow_id }))
    }

    return (
        <TouchableOpacity onPress={() => openOtherUser(user)} key={user._id}>
            <View style={{
                width: 110,
                height: 180,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10,
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: GlobalStyles[theme].fontColor,
                marginHorizontal: 5,
                backgroundColor: GlobalStyles[theme].paperColor,
            }}>
                <Image
                    source={require("../assets/images/user-profile.jpeg")}

                    // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                    // source={{ uri: userContext?.profilePicture }}
                    style={{
                        height: 90,
                        width: 90,
                        borderRadius: 45,
                        borderWidth: 0.5,
                        borderColor: GlobalStyles[theme].fontColor,
                        // marginTop: 10,
                    }}
                />
                <View style={{ height: 40, flexDirection: 'column', justifyContent: 'center' }}>
                    <Text style={{ marginBottom: 0, overflow: 'hidden', height: 20, fontFamily: GlobalFontStyles[fontStyle].fontStyle, color: GlobalStyles[theme].fontColor }}>{user.userName}</Text>
                    {/* <Text style={{ marginBottom: 0 }}>{user.userName}</Text> */}
                </View>

                <TouchableOpacity
                    onPress={() => startFollowingFn(user._id)}
                    style={{
                        height: 25,
                        width: 90,
                        justifyContent: 'center',
                        borderWidth: 0.5,
                        borderColor: GlobalStyles[theme].fontColor,
                        borderRadius: 5,
                        backgroundColor: GlobalStyles[theme].lightBlue,
                        // paddingHorizontal: 25,
                        // marginBottom: 10,
                    }}>
                    <Text style={{fontSize: 15, textAlign: 'center' }}>{trans[language].FOLLOW}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default UserHomeCard

const styles = StyleSheet.create({})