import React, { useState } from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Pressable,
    Modal,
    ScrollView
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const initialValue = {
    recipeName: '',
    prepTime: '',
    cookTime: '',
    difficulty: '',
    forHowMany: '',
    specialDiet: [],
    tags: [],
    ingredients: [{}],
    preparation: [{}]
}

const difficulty = [
    "Super Easy",
    "Easy",
    "Medium",
    "Hard",
    "Super Hard"
]

const specialDiet = [
    "Vegan",
    "Vegetarian",
    "Lactose Free",
    "Peanut Free",
    "Soy Free",
    "Gluten Free",
    "Sea Food",
    "Contain Fish",
    "Contain Nuts",
    "Contain Eggs",
    "No Added Sugar",
    "No Added Salt",
    "Low Fat",
    "Spicy",
    "Halal",
    "Kosher",
]

export default function NewRecipe({ navigation }) {
    const [recipeForm, setRecipeForm] = useState(initialValue)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [difficultyColor, setDifficultyColor] = useState("#F194FF")


    const handleOnChange = (name, text) => {
        if (name === tags && text.length > 1) {
            if (text.charAt(text.length - 1) === "," || text.charAt(text.length - 1) === " ") {
                if (!recipeForm.tags.includes(text.slice(0, text.length - 1)))
                    setRecipeForm({ ...recipeForm, tags: [...recipeForm.tags, "#" + text.slice(0, text.length - 1)] })
            }
        }

        console.log('====================================');
        console.log(text.charAt(text.length - 1));
        console.log('====================================');
        setRecipeForm({ ...recipeForm, [name]: text })
    }

    const handleDifficulty = (text) => {
        switch (text._dispatchInstances.pendingProps.children) {
            case "Super Easy":
                setDifficultyColor("lime")
                break
            case "Easy":
                setDifficultyColor("greenyellow")
                break
            case "Medium":
                setDifficultyColor("orange")
                break
            case "Hard":
                setDifficultyColor("salmon")
                break
            case "Super Hard":
                setDifficultyColor("red")
                break
        }
        setRecipeForm({ ...recipeForm, difficulty: text._dispatchInstances.pendingProps.children })
        setModalVisible(!modalVisible)
    }

    const handleSpecialDiet = (text) => {

        if (!recipeForm.specialDiet.includes(text._dispatchInstances.pendingProps.children)) {
            setRecipeForm({ ...recipeForm, specialDiet: [...recipeForm.specialDiet, text._dispatchInstances.pendingProps.children] })
        }
        setModalVisible2(!modalVisible2)
    }

    const remove = (text) => {
        const result = recipeForm.specialDiet.filter(item => item !== text._dispatchInstances.pendingProps.children[0])
        setRecipeForm({ ...recipeForm, specialDiet: result })
        console.log('====================================');
        console.log(result);
        console.log('====================================');
    }

    const handleKeyPress = (text) => {
        console.log('====================================');
        console.log(text);
        // nativeEvent.key
        console.log('====================================');
    }

    const handleAdd = () => {
        console.log('====================================');
        console.log("recipeForm", recipeForm);
        console.log('====================================');
    }

    const clearForm = () => {
        setRecipeForm(initialValue)
        setDifficultyColor("#F194FF")
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Text>New Recipe</Text>
                <View style={styles.inputLogo}>
                    <TextInput
                        value={recipeForm.recipeName}
                        style={styles.input}
                        placeholder='Recipe Name'
                        onChangeText={text => handleOnChange('recipeName', text)}
                    />
                </View>

                <View style={styles.cookInfo}>
                    <View style={styles.cookItem}>
                        <Text>Prep.Time</Text>
                        <View style={styles.logoInput}>
                            <Entypo name="stopwatch" size={24} color="black" />
                            <TextInput
                                value={recipeForm.prepTime}
                                style={styles.numberInput}
                                keyboardType='numeric'
                                onChangeText={text => handleOnChange('prepTime', text)}
                            />
                            <Text>min</Text>
                        </View>
                    </View>
                    <View style={styles.cookItem}>
                        <Text>Cook Time</Text>
                        <View style={styles.logoInput}>
                            <Entypo name="stopwatch" size={24} color="black" />
                            <TextInput
                                value={recipeForm.cookTime}
                                style={styles.numberInput}
                                keyboardType='numeric'
                                onChangeText={text => handleOnChange('cookTime', text)}
                            />
                            <Text>min</Text>
                        </View>
                    </View>


                    <View style={styles.cookItem}>
                        <Text style={styles.cookText}>Difficulty</Text>
                        <View style={styles.logoInput}>
                            <MaterialCommunityIcons name="chef-hat" size={24} color="black" />

                            <View style={styles.centeredView}>
                                <Modal
                                    animationType="fade"
                                    transparent={true}
                                    visible={modalVisible}
                                >
                                    <View style={styles.centeredView}>
                                        <View style={styles.modalView}>
                                            {difficulty.map(level =>
                                                <Pressable
                                                    key={level}
                                                    style={[styles.button, styles.buttonClose]}
                                                >
                                                    <Text style={styles.textStyle}
                                                        onPress={(text) => handleDifficulty(text)}>
                                                        {level}</Text>
                                                </Pressable>
                                            )}
                                        </View>
                                    </View>
                                </Modal>
                                <Pressable
                                    style={[styles.button, styles.buttonOpen]}
                                    backgroundColor={difficultyColor}
                                    onPress={() => setModalVisible(true)}
                                >
                                    {(recipeForm.difficulty === "")
                                        ? <Text style={styles.textStyle}>Dif</Text>
                                        : <Text style={styles.textStyle}>{recipeForm.difficulty.split(" ")[0].slice(0, 1)}{recipeForm.difficulty.split(" ")[1]?.slice(0, 1)}</Text>}
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cookItem}>
                        <Text style={styles.cookText}>Serves</Text>
                        <View style={styles.logoInput}>
                            <Ionicons name="ios-people-circle-outline" size={24} color="black" />
                            <TextInput
                                value={recipeForm.forHowMany}
                                style={styles.numberInput}
                                keyboardType='numeric'
                                onChangeText={text => handleOnChange('forHowMany', text)}
                            />
                            <Text>ppl.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.specialDiet}>
                    <Text style={styles.specialDietText} >
                        {recipeForm.specialDiet.map(item => <Text key={item} onPress={(text) => remove(text)}>{item}, </Text>)}
                    </Text>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible2}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <ScrollView style={styles.scrollView}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {specialDiet.map(diet =>
                                        <Pressable
                                            key={diet}
                                            style={[styles.button, styles.buttonClose]}
                                        >
                                            <Text style={styles.textStyle}
                                                onPress={(text) => handleSpecialDiet(text)}>
                                                {diet}</Text>
                                        </Pressable>
                                    )}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>

                    <Pressable
                        style={[styles.button, styles.buttonOpen2]}
                        onPress={() => setModalVisible2(true)}
                    >
                        <Text style={styles.textStyle2}>S.Diet</Text>
                    </Pressable>
                </View>

                <View style={styles.inputLogo}>
                    <TextInput
                        value={recipeForm.tags}
                        style={styles.input}
                        placeholder='Your Tags'
                        onChangeText={text => handleOnChange('tags', text)}
                    // onKeyPress={(text) => handleKeyPress(text)}
                    />
                </View>







                <View style={styles.container}>
                    <Button title='Clear Form' onPress={clearForm} />
                    <Button title='Add' onPress={handleAdd} />
                </View>


            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputLogo: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "90%",
        height: 45,
        borderRadius: 10,
        // marginBottom: 10,
        marginVertical: 10,

    },
    input: {
        width: "100%",
        height: 40,
        borderRadius: 10,
        backgroundColor: "white",
        paddingLeft: 10,
    },
    cookInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: "90%",
        height: 80,
        borderRadius: 10,
        backgroundColor: "white",

    },
    cookItem: {
        width: 70,
    },
    cookText: {
        alignSelf: 'center'
    },
    logoInput: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%"
    },
    numberInput: {
        width: 30,
        height: 40,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        textAlign: "center"
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: 400,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 150
    },
    buttonOpen: {
        width: 40,
        height: 40
    },
    buttonOpen2: {
        backgroundColor: "#F194FF",
        width: 60,
        height: 40
    },
    buttonClose: {
        // backgroundColor: "#2196F3",
        marginVertical: 5
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    },
    textStyle2: {
        width: 50

    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    specialDiet: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: 'center',
        width: "90%",
        justifyContent: 'space-between'
    },
    specialDietText: {
        justifyContent: 'flex-start',
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 10,
        minHeight: 40,
        flexDirection: "row",
    },
})