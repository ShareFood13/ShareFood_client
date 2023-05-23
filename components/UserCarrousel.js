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

import { startFollowing } from '../Redux/actions/auth'
import UserHomeCard from './UserHomeCard';

const UserCarrousel = ({ otherUsersList, following, navigation, userId }) => {
    const dispatch = useDispatch()
    const [theme, setTheme] = useState("stylesLight")

    // console.log("UserCarrousel otherUsersList", otherUsersList)
    // console.log("UserCarrousel following", following)
    // console.log("UserCarrousel userId", userId)

    const openOtherUser = (userInfo) => {
        navigation.navigate("ShowOtherUser", { userInfo })
    }

    const startFollowingFn = (follow_id) => {
        dispatch(startFollowing({ userId, follow_id }))
    }

    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginLeft: 5, marginBottom: 10 }}
        >
            {otherUsersList.map(user => !following?.includes(user._id) &&
                <UserHomeCard user={user} navigation={navigation} userId={userId} key={user._id}/>

                    // <TouchableOpacity onPress={() => openOtherUser(user)} key={user._id}>
                    //     <View style={{
                    //         width: 90,
                    //         height: 150,
                    //         borderRadius: 10,
                    //         borderWidth: 0.5,
                    //         borderColor: 'black',
                    //         marginHorizontal: 5,
                    //         alignItems: 'center',
                    //         justifyContent: 'center',
                    //         backgroundColor: GlobalStyles[theme].paperColor
                    //     }}>
                    //         <Image
                    //             source={require("../assets/images/user-profile.jpeg")}
                                
                    //             // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                    //             // source={{ uri: userContext?.profilePicture }}
                    //             style={{ height: 70, width: 70, borderRadius: 35, marginBottom: 5, borderWidth: 0.5, borderColor: 'black' }}
                    //         />

                    //         <Text style={{ marginBottom: 5 }}>{user.userName}</Text>

                    //         <TouchableOpacity
                    //             onPress={() => startFollowingFn(user._id)}
                    //             style={{
                    //                 borderWidth: 0.5,
                    //                 borderColor: 'black',
                    //                 borderRadius: 5,
                    //                 paddingHorizontal: 15,
                    //                 marginBottom: 5,
                    //                 backgroundColor: GlobalStyles[theme].lightBlue
                    //             }}>
                    //             <Text style={{ fontWeight: '400', }}>Follow</Text>
                    //         </TouchableOpacity>
                    //     </View>
                    // </TouchableOpacity>
            )}
        </ScrollView>
    )
}

export default UserCarrousel

const styles = StyleSheet.create({})