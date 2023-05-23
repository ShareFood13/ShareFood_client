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
const windowWidth = Dimensions.get('window').width;

import { useSelector } from 'react-redux';


const BannerFollowers = ({ countRecipe, userInfo, userImage, userContext }) => {
    const [theme, setTheme] = useState("stylesLight")

    return (
        <View style={{
            flexDirection: "row",
            height: 60,
            width: "100%",
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginVertical: 25,
            backgroundColor: GlobalStyles[theme].paperColor,
            alignContent: 'center',
            position: 'relative',
        }}>
            <Image
                // source={require("../../assets/images/user-profile.jpeg")}
                // source={{ uri: userContext?.profilePicture }}
                source={{ uri: userImage ? userImage : userInfo?.profile?.profilePicture?.base64 }}
                style={{ height: 90, width: 90, borderRadius: 45, position: 'absolute', left: 20 }}
            />
            <View style={{ flexDirection: 'row', width: windowWidth - 150, justifyContent: 'space-between', right: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{countRecipe}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Recipes</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{userContext ? userContext?.followers?.length : userInfo?.profile?.followers?.length}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Followers</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{userContext ? userContext?.following?.length : userInfo?.profile?.following?.length}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Following</Text>
                </View>
            </View>
        </View>

    )
}

export default BannerFollowers

const styles = StyleSheet.create({})