import React, { useContext } from 'react'
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import { Context } from "../../context/UserContext";
import SuperSearch from '../../components/SuperSearch';
import { useDispatch, useSelector } from 'react-redux';
const windowWidth = Dimensions.get('window').width


export default function Search({ navigation }) {
    const { userContext } = useContext(Context)
    const redux = useSelector((state) => state)
    console.log("Search redux", redux?.recipe?.recipes)

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <FlatList
                ListHeaderComponent={<SuperSearch />}
                ListHeaderComponentStyle={{ marginBottom: 10, alignItems: 'center' , zIndex: 200}}
                data={redux?.recipe?.recipes}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                initialNumToRender={9}
                maxToRenderPerBatch={9}
                renderItem={({ item }) =>
                    (!item?.isDeleted) ?
                        <TouchableOpacity onPress={() => openRecipe(item)}>
                            <View style={{ width: windowWidth / 3, height: windowWidth / 3, borderWidth: 0.2, borderColor: 'black' }}>
                                <Image source={{ uri: item?.recipePicture?.normal[0] }} style={{ width: windowWidth / 3, height: windowWidth / 3, resizeMode: "cover", }} />
                            </View>
                        </TouchableOpacity>
                        : null
                }
                key={'_'}
                keyExtractor={item => "_" + item._id}
            />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})