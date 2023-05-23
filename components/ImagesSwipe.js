import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native'

import { AntDesign } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import GlobalStyles from '../GlobalStyles';

const ImagesSwipe = ({ showImage, setShowImage, recipeFormRecipePicture, delIngredient }) => {
    // console.log("ImagesSwipe showImage", showImage)
    const [theme, setTheme] = useState('stylesLight')

    return (
        <View style={styles.container}>
            {recipeFormRecipePicture.length !== 0 ?
                <ScrollView
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollImage}>

                    {recipeFormRecipePicture.map((image, index) =>
                        <View key={image.path ? image.path : image}>
                            <Image source={{ uri: image.path ? image.path : image }}
                                style={[styles.image, {
                                    left: -(windowWidth - 20) * (showImage),
                                }]} />
                            {delIngredient && <TouchableOpacity style={styles.delImg} onPress={() => delIngredient(showImage, "picture")}>
                                <AntDesign name="delete" size={24} color="black" />
                            </TouchableOpacity>}

                            {recipeFormRecipePicture.length > 1 &&
                                <View style={styles.imageScreen}>
                                    <View style={{ width: "50%", height: "100%" }}>
                                        {showImage > 0 &&
                                            <TouchableOpacity onPress={() => setShowImage(showImage => showImage - 1)}
                                                style={{
                                                    width: "100%",
                                                    height: windowWidth * 0.61,
                                                }}>
                                            </TouchableOpacity>}
                                    </View>
                                    <View style={{ width: "50%", height: "100%" }}>
                                        {showImage < (recipeFormRecipePicture.length - 1) &&
                                            <TouchableOpacity onPress={() => setShowImage(showImage => showImage + 1)}
                                                style={{
                                                    width: "100%",
                                                    height: windowWidth * 0.61,
                                                }}>
                                            </TouchableOpacity>}
                                    </View>
                                </View>
                            }
                        </View>)}
                </ScrollView>
                : <View style={{ height: '100%', width: '100%', backgroundColor: GlobalStyles[theme].paperColor }} />}
        </View>

    )
}

export default ImagesSwipe

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 0.05,
        alignItems: 'center',
        justifyContent: 'center',
        // width: windowWidth * 0.9,
        width: "100%",
        height: windowWidth * 0.61,
        marginVertical: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        zIndex: 5,
        elevation: 5
    },
    delImg: {
        position: 'absolute',
        bottom: 15,
        right: 10,
        zIndex: 10,
        elevation: 10,
    },
    image: {
        width: windowWidth - 20,
        height: windowWidth * 0.61,
        resizeMode: "cover",
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: 'black',
        // marginVertical: 10,
    },
    imageScreen: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignSelf: 'center',
        width: "100%",
        top: 10,
        left: 0,
        zIndex: 5,
        elevation: 5,
    },
    scrollImage: {
        position: 'absolute',
        width: "100%",
        height: windowWidth * 0.61,
        marginBottom: 10,
    }
})