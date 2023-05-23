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


const UserHomeCard = ({ user, navigation, userId }) => {
    const [theme, setTheme] = useState("stylesLight")
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
                borderColor: 'black',
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
                        borderColor: 'black',
                        // marginTop: 10,
                    }}
                />
                <View style={{ height: 40, flexDirection: 'column', justifyContent: 'center' }}>
                    <Text style={{ marginBottom: 0, overflow: 'hidden', height: 20, fontWeight: 'bold' }}>{user.userName}</Text>
                    {/* <Text style={{ marginBottom: 0 }}>{user.userName}</Text> */}
                </View>

                <TouchableOpacity
                    onPress={() => startFollowingFn(user._id)}
                    style={{
                        height: 20,
                        width: 90,
                        justifyContent: 'center',
                        borderWidth: 0.5,
                        borderColor: 'black',
                        borderRadius: 5,
                        backgroundColor: GlobalStyles[theme].lightBlue,
                        // paddingHorizontal: 25,
                        // marginBottom: 10,
                    }}>
                    <Text style={{ fontWeight: '500', textAlign: 'center' }}>Follow</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default UserHomeCard

const styles = StyleSheet.create({})