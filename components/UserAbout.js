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
import React from 'react'
import GlobalStyles from '../GlobalStyles'
import { useState } from 'react'
import { Entypo, MaterialIcons, Foundation, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';


const UserAbout = ({ userContext, setMoreHeight, moreHeight }) => {
    const [theme, setTheme] = useState("stylesLight")

    console.log("UserAbout", userContext)

    return (
        <View style={{
            backgroundColor: GlobalStyles[theme].paperColor,
            marginHorizontal: 10,
            borderRadius: 10,
            marginBottom: 10,
            borderWidth: 0.5,
            borderColor: 'black',
            // paddingVertical: 10
        }}>
            <View style={moreHeight && { maxHeight: 100, overflow: 'hidden' }}>
                <Text style={{ width: '95%', textAlign: 'justify', alignSelf: 'center', marginBottom: 5 }}>
                    {userContext?.personalDescription}
                </Text>

                {userContext?.socialMediaHandles?.facebook &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <Entypo name="facebook" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.facebook}</Text>
                    </View>
                }
                {userContext?.socialMediaHandles?.instagram &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <Entypo name="instagram" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.instagram}</Text>
                    </View>
                }
                {userContext?.socialMediaHandles?.pinterest &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <Entypo name="pinterest" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.pinterest}</Text>
                    </View>
                }
                {userContext?.socialMediaHandles?.tiktok &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <FontAwesome5 name="tiktok" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.tiktok}</Text>
                    </View>
                }
                {userContext?.socialMediaHandles?.blog &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <FontAwesome5 name="blogger" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.blog}</Text>
                    </View>
                }
            </View>
            <TouchableOpacity onPress={() => setMoreHeight(!moreHeight)} style={{ width: "100%", alignContent: 'flex-end' }}>
                {moreHeight
                    ? <Text style={{ width: "95%", textAlign: 'right' }}>...more</Text>
                    : <Text style={{ width: "95%", textAlign: 'right' }}>...less</Text>}
            </TouchableOpacity>
        </View>
    )
}

export default UserAbout

const styles = StyleSheet.create({})