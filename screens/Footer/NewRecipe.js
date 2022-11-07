import React, { useState } from 'react'

import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Pressable,
    Modal,
    ScrollView,
    Image,
    Dimensions,
    Alert
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import * as ImagePicker from 'expo-image-picker';

const initialPreparation = {
    step: "",
    preparation: "",
}

const initialIngredients = {
    product: "",
    quantity: "",
    units: "",
    remarks: "",
}

const initialValue = {
    recipeName: '',
    recipePicture: [],
    prepTime: '',
    cookTime: '',
    difficulty: '',
    forHowMany: '',
    specialDiet: [],
    tags: [],
    ingredients: [],
    preparation: []
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

const units = [
    "units",
    "grams",
    "kg",
    "ml",
    "liters",
    "spoon",
    "tspoon",
    "cups"
]


export default function NewRecipe({ navigation }) {
    const [recipeForm, setRecipeForm] = useState(initialValue)
    const [ingredients, setIngredients] = useState(initialIngredients)
    const [preparation, setPreparation] = useState(initialPreparation)
    const [oldStep, setOldStep] = useState(0)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [difficultyColor, setDifficultyColor] = useState("#F194FF")
    const [tagsValue, setTagsValue] = useState("")
    const [image, setImage] = useState(null);
    const [recipeStep, setRecipeStep] = useState(1)

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;


    const handleOnChange = (name, text) => {
        if (name === "tags") {
            if (text.charAt(text.length - 1) === '#') {
                return setTagsValue(text.slice(0, text.length - 1))
            }
            setTagsValue(text)
            if (text.charAt(text.length - 1) === "," || text.charAt(text.length - 1) === " ") {
                if (!recipeForm.tags.includes("#" + text.slice(0, text.length - 1).toLowerCase()) && text !== " " && text !== ",")
                    setRecipeForm({ ...recipeForm, tags: [...recipeForm.tags, "#" + text.slice(0, text.length - 1).toLowerCase()] })
                setTagsValue("")
            }
        } else {
            setRecipeForm({ ...recipeForm, [name]: text })
        }
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

    const handleIngredients = (name, text) => {
        if (text !== " ") {
            if (name === "units") {
                setIngredients({ ...ingredients, [name]: text._dispatchInstances.pendingProps.children })
                setModalVisible3(!modalVisible3)
            } else {
                setIngredients({ ...ingredients, [name]: text })
            }
        }
    }

    const addIngredient = () => {
        if (ingredients.product === "" || ingredients.quantity === "" || ingredients.units === "") return
        setRecipeForm({ ...recipeForm, ingredients: [...recipeForm.ingredients, ingredients] })
        setIngredients(initialIngredients)
    }

    const editIngredient = (product) => {
        const result = recipeForm.ingredients.filter(item => item.product === product)
        delIngredient(product, "ingredient")
        setIngredients(result[0])
    }

    const delIngredient = (product, name) => {
        if (name === "ingredient") {
            const result = recipeForm.ingredients.filter(item => item.product !== product)
            setRecipeForm({ ...recipeForm, ingredients: result })
        }
        if (name === "picture") {
            const result2 = recipeForm.recipePicture.filter(item => item.base64 !== product)
            setRecipeForm({ ...recipeForm, recipePicture: result2 })
        }
    }

    const handlePreparation = (text) => {
        setPreparation({ step: recipeForm.preparation.length + 1, preparation: text })
    }

    const addStep = () => {
        if (preparation.preparation.trim() === "") {
            setPreparation(initialPreparation)
            setOldStep(0)
            return
        }
        if (oldStep === 0) {
            setRecipeForm({ ...recipeForm, preparation: [...recipeForm.preparation, preparation] })
            setPreparation(initialPreparation)
        } else {
            setRecipeForm({
                ...recipeForm, preparation: recipeForm.preparation.map(item => item.step !== oldStep ? item : { preparation: preparation.preparation, step: oldStep })
            })
            setPreparation(initialPreparation)
            setOldStep(0)
        }
    }

    const editStep = (step) => {
        const result = recipeForm.preparation.filter(item => item.step === step)
        setOldStep(result[0].step)
        setPreparation(result[0])
    }

    const delStep = (step) => {
        const result = recipeForm.preparation.filter(item => item.step !== step)
        result.map((item, index) => item.step = index + 1)
        setRecipeForm({ ...recipeForm, preparation: result })
    }

    const remove = (text, name) => {
        switch (name) {
            case "specialDiet":
                const result1 = recipeForm.specialDiet.filter(item => item !== text._dispatchInstances.pendingProps.children[0])
                setRecipeForm({ ...recipeForm, specialDiet: result1 })
                break
            case "tags":
                const result2 = recipeForm.tags.filter(item => item !== text._dispatchInstances.pendingProps.children[0])
                setRecipeForm({ ...recipeForm, tags: result2 })
                break
        }
    }

    const handleAdd = () => {
        console.log('====================================');
        console.log("recipeForm", recipeForm);
        console.log('====================================');
    }

    const clearForm = () => {
        setRecipeForm(initialValue)
        setIngredients(initialIngredients)
        setPreparation(initialPreparation)
        setTagsValue("")
        setDifficultyColor("#F194FF")
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setRecipeForm({ ...recipeForm, recipePicture: [...recipeForm.recipePicture, { path: result.uri, base64: `data:image/jpg;base64,${result.base64}` }] })
        } else {
            Alert.alert(
                'Adding pincture.',
                'Action Canceller!!!',
                [
                    { text: "OK" }
                ])
        }
    };

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <KeyboardAvoidingView style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    {recipeStep === 1 &&
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', minHeight: windowHeight - 200 }}>
                            <Text style={styles.banner}>New Recipe</Text>

                            <View style={styles.inputLogo}>
                                <TextInput
                                    value={recipeForm.recipeName}
                                    style={styles.input}
                                    placeholder='Recipe Name'
                                    onChangeText={text => handleOnChange('recipeName', text)}
                                />
                            </View>

                            <View style={{ flex: 0.05, alignItems: 'center', justifyContent: 'center', }}>
                                {recipeForm.recipePicture.length > 0 && <ScrollView
                                    pagingEnabled
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{ width: windowWidth * 0.9, height: windowWidth * 0.54, marginBottom: 10 }}>
                                    {recipeForm.recipePicture.map((image, index) =>
                                        <View key={uuid.v4()} style={{ position: 'relative' }}>
                                            <Image key={uuid.v4()} source={{ uri: image.base64 }} style={{ width: windowWidth * 0.9, height: windowWidth * 0.54, resizeMode: "cover", marginVertical: 10 }} />
                                            <TouchableOpacity style={styles.delImg} key={uuid.v4()} onPress={() => delIngredient(image.base64, "picture")}>
                                                <AntDesign name="delete" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>)}
                                </ScrollView>}
                                {recipeForm.recipePicture.length < 3 &&
                                    <TouchableOpacity>
                                        <Text onPress={pickImage}>Add an image. {recipeForm.recipePicture.length}/3</Text>
                                    </TouchableOpacity>}
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
                                                                key={uuid.v4()}
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
                                    {recipeForm.specialDiet.map(item => <Text key={uuid.v4()} onPress={(text) => remove(text, "specialDiet")}>{item}, </Text>)}
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
                                                        key={uuid.v4()}
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
                                    <Text style={[styles.textStyle, styles.textStyle2]}>S.Diet</Text>
                                </Pressable>
                            </View>

                            <View style={styles.inputTags}>
                                <TouchableOpacity onPress={() => Alert.alert(
                                    'HashTag',
                                    'Just press "space" or "," to enter your HashTag, \nNo need for #. \nMaximum 14 Characters.\nTo delete one just click on it.',
                                    [
                                        { text: "OK" }
                                    ])}>
                                    <FontAwesome5 name="hashtag" size={24} color="black" />
                                </TouchableOpacity>
                                <TextInput
                                    value={tagsValue}
                                    style={{ width: "90%", paddingLeft: 10 }}
                                    placeholder='Your Tags'
                                    maxLength={15}
                                    onChangeText={text => handleOnChange('tags', text)}
                                // onKeyPress={(text) => handleKeyPress(text)}
                                />
                            </View>
                            <Text style={styles.outputTags} >
                                {recipeForm.tags.map(item => <Text key={item} onPress={(text) => remove(text, "tags")}>{item}, </Text>)}
                            </Text>
                        </View>}

                    {recipeStep === 2 &&
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', minHeight: windowHeight - 200 }}>

                            <Text style={styles.banner}>Ingredients</Text>

                            <View style={styles.inputIngredients}>

                                <TextInput
                                    value={ingredients.quantity}
                                    style={styles.quantity}
                                    keyboardType='numeric'
                                    placeholder='qty'
                                    onChangeText={text => handleIngredients('quantity', text)}
                                />
                                <View style={styles.centeredView}>
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={modalVisible3}
                                    >
                                        <View style={styles.centeredView}>
                                            <View style={[styles.modalView, styles.modalView2]}>
                                                {units.map(unit =>
                                                    <Pressable
                                                        key={uuid.v4()}
                                                        style={[styles.button, styles.buttonClose]}
                                                    >
                                                        <Text style={styles.textStyle}
                                                            onPress={(text) => handleIngredients('units', text)}>
                                                            {unit}
                                                        </Text>
                                                    </Pressable>
                                                )}
                                            </View>
                                        </View>
                                    </Modal>
                                    <Pressable
                                        style={[styles.button3]}
                                        onPress={() => setModalVisible3(true)}
                                    >
                                        {(ingredients.units === "")
                                            ? <Text style={styles.textStyle}>Un.</Text>
                                            : <Text style={styles.textStyle}>{ingredients.units}</Text>}
                                    </Pressable>
                                </View>
                                <TextInput
                                    value={ingredients.product}
                                    style={styles.product}
                                    placeholder='Ingredients'
                                    onChangeText={text => handleIngredients('product', text)}
                                />
                                <TextInput
                                    value={ingredients.remarks}
                                    style={styles.remarks}
                                    placeholder='Remarks'
                                    onChangeText={text => handleIngredients('remarks', text)}
                                />
                                <Button title='Add' onPress={addIngredient} />
                            </View>

                            {recipeForm.ingredients.map(item =>
                                <View style={styles.outputIngredients} key={uuid.v4()}>
                                    <Text style={styles.quantity} key={uuid.v4()}>{item.quantity}</Text>
                                    <Text style={styles.units} key={uuid.v4()}>{item.units}</Text>
                                    <Text style={styles.product} key={uuid.v4()}>{item.product}</Text>
                                    <Text style={styles.remarks} key={uuid.v4()}>{item.remarks}</Text>
                                    <View style={styles.buttons} key={uuid.v4()}>
                                        <TouchableOpacity style={styles.validation} key={uuid.v4()} onPress={() => editIngredient(item.product)}>
                                            <Feather name="edit-3" size={24} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.validation} key={uuid.v4()} onPress={() => delIngredient(item.product, "ingredient")}>
                                            <AntDesign name="delete" size={24} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>}

                    {recipeStep === 3 &&
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', minHeight: windowHeight - 200 }}>

                            <View>
                                <Text style={styles.banner}>Preparation</Text>
                            </View>

                            <View style={[styles.inputPreparation, styles.inputIngredients]}>

                                <TextInput
                                    value={preparation.preparation}
                                    style={styles.preparation}
                                    keyboardType='ascii-capable'
                                    placeholder='Preparation Step'
                                    onChangeText={text => handlePreparation(text)}
                                // multiline
                                // numberOfLines={2}
                                />
                                <Button title='Add' onPress={addStep} />
                            </View>
                            {recipeForm.preparation.map(item =>
                                <View style={styles.outputPreparation} key={uuid.v4()}>
                                    <Text style={styles.step} key={uuid.v4()}>Step {item.step}</Text>
                                    <Text style={styles.prep} key={uuid.v4()}>{item.preparation}</Text>
                                    <View style={styles.buttons} key={uuid.v4()}>
                                        <TouchableOpacity style={styles.validation} key={uuid.v4()} onPress={() => editStep(item.step)}>
                                            <Feather name="edit-3" size={24} color="black" />
                                        </TouchableOpacity>
                                        {(recipeForm.preparation[recipeForm.preparation.length - 1].step === item.step) &&
                                            <TouchableOpacity style={styles.validation} key={uuid.v4()} onPress={() => delStep(item.step)}>
                                                <AntDesign name="delete" size={24} color="black" />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            )}

                            < View style={styles.container} >
                                <Button title='Clear Form' onPress={clearForm} />
                                <Button title='Add' onPress={handleAdd} />
                            </View>
                        </View>}

                    <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', width: "100%" }}>
                        <View style={{
                            flexDirection: 'row', width: "90%", justifyContent: 'space-between'
                        }}>
                            <View style={{ justifyContent: 'flex-start' }}>
                                {recipeStep !== 1 && <Button title={'Previous Step'} onPress={() => setRecipeStep(recipeStep => recipeStep - 1)} />}
                            </View>
                            <View style={{ justifyContent: 'flex-end' }}>
                                {recipeStep !== 3 && <Button title={'Next Step'} onPress={() => setRecipeStep(recipeStep => recipeStep + 1)} />}
                            </View>
                        </View>
                    </View>

                </KeyboardAvoidingView>
            </ScrollView >
        </TouchableWithoutFeedback >
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    banner: {
        width: 350,
        height: 40,
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        fontSize: 18,
        marginVertical: 10,
        backgroundColor: "orange",
        // color: 'white',
    },
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
        minHeight: 45,
        borderRadius: 10,
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
        // marginTop: 10
    },
    cookItem: {
        width: 70,
    },
    cookText: {
        alignSelf: 'center'
    },
    delImg: {
        position: 'absolute',
        bottom: 5,
        right: 5
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
    modalView2: {
        maxHeight: 600,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 150
    },
    buttonOpen: {
        width: 40,
        height: 40,
    },
    buttonOpen2: {
        backgroundColor: "#F194FF",
        width: 60,
        height: 40,

    },
    button3: {
        width: 50,
        height: "100%",
        justifyContent: 'center',
        textAlignVertical: 'center'
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
        width: 50,
        alignSelf: 'center'

    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    specialDiet: {
        marginVertical: 10,
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
        textAlignVertical: 'center'

    },
    showTags: {
        width: "80%",
        backgroundColor: "white",
        minHeight: 45,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        paddingLeft: 10,
        textAlignVertical: 'center'
    },
    inputTags: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: "90%",
        width: "90%",
        backgroundColor: "white",
        height: 45,
        borderRadius: 10,
        paddingStart: 10,
        fontSize: 16
    },
    outputTags: {
        minWidth: "90%",
        maxWidth: "90%",
        backgroundColor: "white",
        minHeight: 45,
        borderRadius: 10,
        marginTop: 10,
        fontSize: 15,
        padding: 10,

    },
    inputIngredients: {
        width: "90%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        marginBottom: 10,
        borderRadius: 10
    },
    outputIngredients: {
        width: "90%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 25,
        marginBottom: 5
    },
    product: {
        width: 110,
        paddingLeft: 5,
        textAlignVertical: 'center',

    },
    quantity: {
        width: 40,
        paddingLeft: 10,
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    units: {
        width: 50,
        textAlignVertical: 'center',
        textAlign: 'center'

    },
    remarks: {
        width: 110,
        textAlignVertical: 'center',
        paddingLeft: 5

    },
    buttons: {
        width: 50,
        flexDirection: "row",
        alignSelf: 'center',
        justifyContent: 'center'
    },
    inputPreparation: {
        minHeight: 40

    },
    preparation: {
        width: "88%",
        paddingLeft: 10,
    },
    outputPreparation: {
        width: "90%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 25,
        marginBottom: 5,
        textAlignVertical: 'center'
    },
    step: {
        width: 60,
        paddingLeft: 10,
        textAlignVertical: 'center',

    },
    prep: {
        width: 240,
        textAlignVertical: 'center',
        justifyContent: 'flex-start',
        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderColor: 'black'


    },
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        width: 100,
        // marginLeft: 35,
        // marginRight: 35,
        // marginTop: 15,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
})


// import DocumentPicker from 'react-native-document-picker';

// const [singleFile, setSingleFile] = useState(null);

// const selectFile = async () => {
//     try {
//         const res = await DocumentPicker.pick({
//             type: [DocumentPicker.types.allFiles],
//         });
//         // console.log('res : ' + JSON.stringify(res));
//         setSingleFile(res);
//     }
//     catch (err) {
//         setSingleFile(null);
//         if (DocumentPicker.isCancel(err)) {
//             alert('Canceled');
//         } else {
//             alert('Unknown Error: ' + JSON.stringify(err));
//             throw err;
//         }
//     }
// }