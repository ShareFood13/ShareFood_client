import React, { useState, useEffect, useCallback, useContext } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { useIsFocused } from '@react-navigation/native';
import { Context } from "../../context/UserContext";

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Pressable,
    Modal,
    ScrollView,
    Image,
    Dimensions,
    Alert,
    FlatList,
    RefreshControl,
    ImageBackground
} from 'react-native'

import { Entypo, EvilIcons, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, FontAwesome } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

import uuid from 'react-native-uuid';

import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, saveProfile } from '../../Redux/actions/auth';

import SwitchButton from '../../components/SwitchButton';
import DatePicker from '../../components/DatePicker';
import PopupModal from '../../components/PopupModal';
import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';
import Banner from '../../components/Banner';
import GlobalStyles from '../../GlobalStyles';

const countries = [];
let countryCodes = [];

const gender = [
    { key: 1, value: 'Male', label: 'Male' },
    { key: 2, value: 'Female', label: 'Female' },
    { key: 5, value: 'Androgynous', label: 'Androgynous' },
    { key: 6, value: 'Aporagender', label: 'Aporagender' },
    { key: 7, value: 'GenderFluid', label: 'Gender Fluid' },
    { key: 11, value: 'Hermaphrodite', label: 'Hermaphrodite' },
    { key: 12, value: 'Intergender', label: 'Intergender' },
    { key: 13, value: 'Intersex', label: 'Intersex' },
    { key: 14, value: 'MTF', label: 'MTF' },
    { key: 15, value: 'Neither', label: 'Neither' },
    { key: 8, value: 'Neutral', label: 'Neutral' },
    { key: 16, value: 'Non-Binary', label: 'Non-Binary' },
    { key: 17, value: 'Pangender', label: 'Pangender' },
    { key: 18, value: 'Polygender', label: 'Polygender' },
    { key: 9, value: 'Questioning', label: 'Questioning' },
    { key: 4, value: 'Trans', label: 'Trans' },
    { key: 19, value: 'Travesti', label: 'Travesti' },
    { key: 20, value: 'Trigender', label: 'Trigender' },
    { key: 21, value: 'Two-Spirit', label: 'Two-Spirit' },
    { key: 10, value: 'Variant', label: 'Variant' },
    { key: 3, value: 'Other', label: 'Other' },
];

const dietaryRestrictions = [
    { key: 1, value: 'vegetarian', label: 'Vegetarian' },
    { key: 2, value: 'vegan', label: 'Vegan' },
    { key: 3, value: 'glutenFree', label: 'Gluten-Free' },
    { key: 4, value: 'paleo', label: 'Paleo' },
    { key: 5, value: 'keto', label: 'Keto' },
    { key: 6, value: 'halal', label: 'Halal' },
    { key: 7, value: 'kosher', label: 'Kosher' },
    { key: 8, value: 'lactoseFree', label: 'Lactose-Free' },
    { key: 9, value: 'nutFree', label: 'Nut-Free' },
    { key: 10, value: 'soyFree', label: 'Soy-Free' },
    { key: 11, value: 'shellfishFree', label: 'Shellfish-Free' },
    { key: 12, value: 'dairyFree', label: 'Dairy-Free' },
    { key: 13, value: 'pescatarian', label: 'Pescatarian' },
    { key: 14, value: 'rawFood', label: 'Raw Food' },
    { key: 15, value: 'noAddedSugar', label: 'No Added Sugar' },
    { key: 16, value: 'hindu', label: 'Hindu' },
    { key: 17, value: 'jain', label: 'Jain' },
    { key: 18, value: 'sikh', label: 'Sikh' },
    { key: 19, value: 'buddhist', label: 'Buddhist' },
    { key: 20, value: 'none', label: 'None' },
    { key: 21, value: 'other', label: 'Other' },
];

const cookingSkills = [
    { key: 1, value: 'None', label: 'None' },
    { key: 2, value: 'Apprentice', label: 'Apprentice' },
    { key: 3, value: 'Cook', label: 'Cook' },
    { key: 4, value: 'Home Cook', label: 'Home Cook' },
    { key: 5, value: 'Hobby Chef', label: 'Hobby Chef' },
    { key: 6, value: 'Professional Chef', label: 'Professional Chef' },
    { key: 7, value: 'Master Chef', label: 'Master Chef' },
    { key: 9, value: 'Gourmet', label: 'Gourmet' },
    { key: 10, value: 'Novice', label: 'Novice' },
    { key: 11, value: 'Food Enthusiast', label: 'Food Enthusiast' },
    { key: 12, value: 'Foodie', label: 'Foodie' },
    { key: 13, value: 'Special Dietary Needs', label: 'Special Dietary Needs' },
    { key: 8, value: 'Other', label: 'Other' },
];

const initialState = {
    name: "",
    userName: "",
    email: "",
    birthDate: "",
    phone: {
        countryCode: "",
        phoneNumber: "",
    },
    gender: "",
    globalStatus: "Public",
    dietaryRestrictions: [],
    profession: "",
    favoriteFood: '',
    favoriteRestaurants: "",
    cookingSkills: '',
    mealPreferences: '',
    foodInterests: '',
    personalDescription: '',
    profilePicture: {},
    backgroundPicture: {},
    fullAddress: {
        address: "",
        addNumber: "",
        country: "",
        zipCode: "",
    },
    socialMediaHandles: {
        instagram: '',
        tiktok: '',
        facebook: '',
        pinterest: '',
        blog: ''
    },
};

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
import GlobalFontStyles from '../../GlobalFontStyles';
import trans from '../../Language'
import GlobalTextStyles from '../../GlobalTextStyles';

export default MyProfile = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const { userContext, setUserContext } = useContext(Context)

    const [profileForm, setProfileForm] = useState();
    const [userData, setUserData] = useState();
    const [show, setShow] = useState("Public")
    const [refreshing, setRefreshing] = useState(false)
    const [popupModal, setPopupModal] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible2, setModalVisible2] = useState(false)
    const [modalVisible3, setModalVisible3] = useState(false)
    const [modalVisible4, setModalVisible4] = useState(false)
    const [modalVisible5, setModalVisible5] = useState(false)
    const [theme, setTheme] = useState('stylesLight')
    const [searchResult, setSearchResult] = useState([])

    const [language, setLanguage] = useState("en")
    const [text, setText] = useState("en")
    const [fontStyle, setFontStyle] = useState("Montserrat")
    let [fontsLoaded] = useFonts({
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
    })

    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    const redux = useSelector(state => state)

    useEffect(() => {
        if (redux?.auth?.message) {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
                // setProfileForm(redux?.auth?.authData?.result?.profile)
            }, 2500)
        }
    }, [redux?.auth?.message])

    // useEffect(() => {
    //     (userData && userData?.userId !== undefined) && dispatch(getUserInfo(userData?.userId))
    // }, [userData, isFocused])

    // useEffect(() => {
    //     console.log("MyProfile isFocused", isFocused)
    //     // setProfileForm(redux?.auth?.authData?.result?.profile)
    //     // setProfileForm(userContext)
    //     // setProfileForm({ ...profileForm, ...userContext })
    //     setProfileForm((profileForm) => ({ ...profileForm, ...userContext }))
    // }, [userData, isFocused])

    useEffect(() => {
        navigation.addListener('focus', () => setProfileForm({ ...profileForm, ...userContext }))
    }, [])

    ///// Countries list
    const [list, setList] = useState([])

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                setList(data);
            })
    }, [])

    useEffect(() => {
        //ascending
        const sortList = [...list].sort((a, b) => {
            return a.name.common.localeCompare(b.name.common)
        })

        sortList.map((item, i) => {
            if (item.idd.suffixes !== undefined && i < 250) {
                countries.push({
                    key: i,
                    value: item.name.common,
                    // code: item.altSpellings[0] + " " + item.idd.root + item.idd.suffixes[0]
                })
            }
        })

        sortList.forEach((item, i) => {
            if (item.idd.suffixes !== undefined && i < 250) {
                countryCodes.push({
                    key: i,
                    value: item.altSpellings[0] + " " + item.idd.root + item.idd.suffixes[0]
                });
            }
        })
    }, [list])

    //////////////////
    ///// get SecureStorage
    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserData(JSON.parse(await SecureStore.getItemAsync('storageData')))
    }

    useEffect(() => {
        userData &&
            setProfileForm({
                ...profileForm,
                name: userData.userName,
                email: userData.userEmail,
                userName: userData.userUserName
            });
    }, [userData])

    //////////
    useEffect(() => {
        setProfileForm({ ...profileForm, globalStatus: show })
    }, [show])

    const pickImageAsync = async (name) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: name === "profilePicture" ? [1, 1] : [4, 3],
            quality: 1,
            exif: true,
        });

        if (!result.canceled) {
            setProfileForm({ ...profileForm, [name]: { path: result.assets[0].uri, base64: `data:image/jpg;base64,${result.assets[0].base64}` } })
        } else {
            Alert.alert(
                'Adding pincture.',
                'Action Canceled!!!',
                [
                    { text: "OK" }
                ])
        }
    };

    const handleChange = (inputName, text) => {
        console.log(inputName, text)
        if (inputName === "countryCode" || inputName === "phoneNumber") {
            setProfileForm({ ...profileForm, phone: { ...profileForm?.phone, [inputName]: text } });
        } else if (inputName === "address" || inputName === "addNumber" || inputName === "country" || inputName === "zipCode") {
            setProfileForm({ ...profileForm, fullAddress: { ...profileForm?.fullAddress, [inputName]: text } });

        } else if (inputName === "dietaryRestrictions") {
            !profileForm?.dietaryRestrictions.includes(text) &&
                setProfileForm({ ...profileForm, [inputName]: [...profileForm?.dietaryRestrictions, text] });
        } else {
            setProfileForm({ ...profileForm, [inputName]: text });
        }
        setModalVisible(false)
        setModalVisible2(false)
        setModalVisible3(false)
        setModalVisible4(false)
        setModalVisible5(false)
        setSearchResult([])

    };

    const handleSocialMediaChange = (socialMediaName, handle) => {
        setProfileForm({ ...profileForm, socialMediaHandles: { ...profileForm?.socialMediaHandles, [socialMediaName]: handle, } });
    };

    // REFRESH FUNCTIONS //////////////////////////////////////////
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(5000).then(() => setRefreshing(false))//.then(dispatch(getUserInfo(userData?.userId)))
    }, []);

    //////////////
    const submitProfile = () => {
        console.log("MyProfile submitProfile", profileForm)
    }

    const clearProfile = () => {
        setProfileForm(initialState)
    }

    const saveProfileSubmit = () => {
        dispatch(saveProfile(userData.userId, profileForm))
        onRefresh()
    }

    const remove = (text, name) => {
        const result2 = profileForm?.dietaryRestrictions.filter(item => item !== text._dispatchInstances.pendingProps.children[0])
        setProfileForm({ ...profileForm, dietaryRestrictions: result2 })
    }

    const infoPickerFunction = (pickerType, selectedDate, formTypeInput) => {
        const info =
            pickerType === 'date'
                ? selectedDate?.toISOString().split('T')[0]
                : selectedDate?.toLocaleTimeString('he-IL');
        setProfileForm({ ...profileForm, [formTypeInput]: info });
    };

    const modalSearch = (name, text) => {
        console.log(name, text)
        switch (name) {
            case "gender":
                setSearchResult(gender.filter(item => item.label.toLowerCase().includes(text.toLowerCase())))
                return
            case "country":
                setSearchResult(countries.filter(item => item.value.toLowerCase().includes(text.toLowerCase())))
                return
            case "countryCode":
                setSearchResult(countryCodes.filter(item => item.value.toLowerCase().includes(text.toLowerCase())))
                return
            case "dietaryRestrictions":
                setSearchResult(dietaryRestrictions.filter(item => item.value.toLowerCase().includes(text.toLowerCase())))
                return
            default:
                return state;
        }
    }
    // console.log(searchResult)
    return (
        <KeyboardAvoidingView
            // style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                width: windowWidth,
                // height: windowHeight,
                // borderStyle: 'solid',
                // borderWidth: 1,
                // borderColor: 'black',
                padding: 10,
                backgroundColor: GlobalStyles[theme].background,

            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                    {/* <Banner title={trans[language].MY_PROFILE} /> */}

                    <ImageBackground
                        // source={require('../../assets/images/menu-bg.jpeg')}
                        // source={{ uri: redux?.auth?.authData?.result?.profile?.backgroundPicture }}
                        // source={userContext?.backgroundPicture ? { uri: userContext?.backgroundPicture } : require('../../assets/images/menu-bg.jpeg')}
                        source={{ uri: profileForm?.backgroundPicture?.base64 }}
                        style={{
                            marginBottom: 0,
                            width: '100%',
                            height: 150,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            borderColor: GlobalStyles[theme].borderColor,
                            backgroundColor: GlobalStyles[theme].paperColor,
                            borderWidth: 0.5
                        }}>
                        <Image
                            // source={require("../../assets/images/user-profile.jpeg")}
                            // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                            // source={userContext?.profilePicture ? { uri: userContext?.profilePicture } : require("../../assets/images/user-profile.jpeg")}
                            source={{ uri: profileForm?.profilePicture?.base64 }}
                            style={{
                                height: 90,
                                width: 90,
                                borderRadius: 45,
                                marginLeft: 30,
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderWidth: 0.5,
                            }}
                        />
                        <TouchableOpacity onPress={() => pickImageAsync('profilePicture')} style={{ flexDirection: 'row', position: 'absolute', zIndex: 5, elevation: 5, left: 90, top: 90 }}>
                            <FontAwesome name="camera-retro" size={30} color="black" style={{ width: 32, height: 30, textAlign: 'center', backgroundColor: 'white' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImageAsync('backgroundPicture')} style={{ flexDirection: 'row', position: 'absolute', zIndex: 5, elevation: 5, right: 10, top: 110 }}>
                            <FontAwesome name="camera-retro" size={30} color="black" style={{ width: 32, height: 30, textAlign: 'center', backgroundColor: 'white' }} />
                        </TouchableOpacity>
                    </ImageBackground>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            color: GlobalStyles[theme].fontColor
                        }}>
                            {trans[language].NAME}:
                        </Text>
                        <Text style={{
                            width: '33%',
                            height: '100%',
                            textAlignVertical: 'center',
                            paddingLeft: 10,
                            borderRadius: 10,
                            marginLeft: 5,
                            backgroundColor: GlobalStyles[theme].paperColor,
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {profileForm?.name?.split(" ")[0]}
                        </Text>

                        <Text style={{
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].SURNAME}:
                        </Text>
                        <Text style={{
                            width: '33%',
                            height: '100%',
                            textAlignVertical: 'center',
                            paddingLeft: 10,
                            borderRadius: 10,
                            marginLeft: 5,
                            backgroundColor: GlobalStyles[theme].paperColor,
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {profileForm?.name?.split(" ")[1]}
                        </Text>
                    </View>

                    {!userContext?.birthDate ?
                        < DatePicker
                            pickerType="date"
                            // setInfoPicked={setInfoPicked}
                            infoPickerFunction={infoPickerFunction}
                            formTypeInput="birthDate"
                            birthDay="true"
                        />
                        : <View style={{
                            flexDirection: 'row',
                            height: 35,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 10
                        }}>
                            <Text style={{
                                width: '30%',
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                                {trans[language].BIRTHDATE}:
                            </Text>
                            <Text style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                                {profileForm?.birthDate}</Text>
                        </View>
                    }

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].USER_NAME}:
                        </Text>
                        <Text style={{
                            width: '70%',
                            height: '100%',
                            textAlignVertical: 'center',
                            paddingLeft: 10,
                            borderRadius: 10,
                            color: GlobalStyles[theme].fontColor,
                            backgroundColor: GlobalStyles[theme].paperColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {userData?.userUserName}</Text>
                        {/* {userContext?.userName}</Text> */}
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].GENDER}:
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)}
                            style={{
                                width: '70%',
                                height: '100%',
                                borderRadius: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                            <Text style={{
                                textAlign: 'left',
                                paddingLeft: 10,
                                textAlignVertical: 'center',
                                height: "100%",
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }}>
                                {profileForm?.gender ? profileForm?.gender : trans[language].GENDER}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].EMAIL}:
                        </Text>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            // value={profileForm?.email}
                            // defaultValue={userData?.userEmail}
                            defaultValue={profileForm?.email}
                            onChangeText={(text) => handleChange('email', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        color: GlobalStyles[theme].fontColor,
                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                    }}>
                        <Text style={{
                            width: '17%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].ADDRESS}:
                        </Text>
                        <TextInput
                            keyboardType='ascii-capable'
                            style={{
                                width: '69%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.fullAddress?.address}
                            onChangeText={(text) => handleChange('address', text)}
                        />
                        <TextInput
                            placeholder={trans[language].NUM}
                            placeholderTextColor={GlobalStyles[theme].fontColor}
                            keyboardType='numeric'
                            style={{
                                width: '12%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingHorizontal: 5,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                textAlign: 'center',
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.fullAddress?.addNumber}
                            onChangeText={(text) => handleChange('addNumber', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        minHeight: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '17%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].COUNTRY}:
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible2(true)}
                            style={{
                                width: '50%',
                                minHeight: 35,
                                borderRadius: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                            <Text style={{
                                textAlign: 'left',
                                minHeight: 35,
                                paddingLeft: 10,
                                paddingVertical: 5,
                                textAlignVertical: 'center',
                                // height: "100%",
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }}>
                                {profileForm?.fullAddress?.country ? profileForm?.fullAddress?.country : trans[language].COUNTRY}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{
                            width: '10%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].ZIP}:
                        </Text>
                        <TextInput
                            keyboardType='numeric'
                            style={{
                                width: '20%',
                                height: '100%',
                                textAlignVertical: 'center',
                                textAlign: 'center',
                                // paddingLeft: 10, 
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.fullAddress?.zipCode}
                            onChangeText={(text) => handleChange('zipCode', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                    }}>
                        <Text style={{
                            width: '28%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].PHONE_NUMBER}:
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible3(true)}
                            style={{
                                width: '40%',
                                height: '100%',
                                borderRadius: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                            <Text style={{
                                textAlign: 'left',
                                paddingLeft: 10,
                                textAlignVertical: 'center',
                                height: "100%",
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }}>
                                {profileForm?.phone?.countryCode ? profileForm?.phone?.countryCode : trans[language].COUNTRY_CODE}
                            </Text>
                        </TouchableOpacity>
                        {/* <SelectList
                            setSelected={(val) => handleChange('countryCode', val)}
                            data={countryCodes}
                            placeholder={profileForm?.phone?.countryCode ? profileForm?.phone?.countryCode : trans[language].COUNTRY_CODE}
                            save="value"
                            inputStyles={{
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor,
                            }}
                            dropdownTextStyles={{
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor,
                            }}
                            boxStyles={{
                                width: 150,
                                borderWidth: 0,
                                borderBottomWidth: 2,
                                borderStyle: 'solid',
                                borderColor: 'black',
                                backgroundColor: GlobalStyles[theme].paperColor,
                                color: GlobalStyles[theme].fontColor,
                                // height: 35
                            }}
                            dropdownItemStyles={{
                                width: 150,
                                color: GlobalStyles[theme].fontColor,
                                // marginBottom: 10,
                            }}
                            dropdownStyles={{
                                position: 'absolute',
                                width: 150,
                                backgroundColor: 'white',
                                elevation: 10,
                                zIndex: 10,
                                top: 40,
                                // left: -25
                            }}
                        />*/}
                        <TextInput
                            keyboardType='numeric'
                            style={{
                                width: '28%',
                                height: '100%',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                // paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.phone?.phoneNumber}
                            onChangeText={(text) => handleChange('phoneNumber', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].PROFESSION}:
                        </Text>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.profession}
                            onChangeText={(text) => handleChange('profession', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].SKILLS}:
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible4(true)}
                            style={{
                                width: '70%',
                                height: '100%',
                                borderRadius: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                            <Text style={{
                                textAlign: 'left',
                                paddingLeft: 10,
                                textAlignVertical: 'center',
                                height: "100%",
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }}>
                                {profileForm?.cookingSkills ? profileForm?.cookingSkills : trans[language].COOKING_SKILLS}                            </Text>
                        </TouchableOpacity>
                        {/* <SelectList
                            setSelected={(val) => handleChange('cookingSkills', val)}
                            data={cookingSkills}
                            placeholder={profileForm?.cookingSkills ? profileForm?.cookingSkills : trans[language].COOKING_SKILLS}
                            save="value"
                            inputStyles={{
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor,
                            }}
                            dropdownTextStyles={{
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor,
                            }}
                            boxStyles={{
                                width: windowWidth * 0.66,
                                borderWidth: 0,
                                borderBottomWidth: 2,
                                borderStyle: 'solid',
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                color: GlobalStyles[theme].fontColor,
                            }}
                            dropdownItemStyles={{
                                width: windowWidth * 0.66,
                                marginBottom: 10,
                                color: GlobalStyles[theme].fontColor,
                            }}
                            dropdownStyles={{
                                width: windowWidth * 0.66,
                                alignSelf: 'center',
                                backgroundColor: 'white',
                                position: 'absolute',
                                elevation: 10,
                                zIndex: 10,
                                top: 40
                            }}
                        /> */}
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].DIET}:
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible5(true)}
                            style={{
                                width: '70%',
                                height: '100%',
                                borderRadius: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                            <Text style={{
                                textAlign: 'left',
                                paddingLeft: 10,
                                textAlignVertical: 'center',
                                height: "100%",
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }}>
                                {trans[language].DIETARY_RESTRICTIONS}
                            </Text>
                        </TouchableOpacity>
                        {/* <SelectList
                            setSelected={(val) => handleChange('dietaryRestrictions', val)}
                            data={dietaryRestrictions}
                            placeholder={trans[language].DIETARY_RESTRICTIONS}
                            save="value"
                            inputStyles={{
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            dropdownTextStyles={{
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            boxStyles={{
                                width: windowWidth * 0.66,
                                borderWidth: 0,
                                borderBottomWidth: 2,
                                borderStyle: 'solid',
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                color: GlobalStyles[theme].fontColor,
                            }}
                            dropdownItemStyles={{
                                width: windowWidth * 0.66,
                                color: GlobalStyles[theme].fontColor,
                                // marginBottom: 10,
                            }}
                            dropdownStyles={{
                                width: windowWidth * 0.66,
                                alignSelf: 'center',
                                backgroundColor: 'white',
                                position: 'absolute',
                                elevation: 10,
                                zIndex: 10,
                                top: 40
                            }}
                        /> */}
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        minHeight: 35,
                        // minWidth: "100%",
                        maxWidth: windowWidth - 20,
                        alignContent: 'center',
                        marginTop: 10,
                        backgroundColor: GlobalStyles[theme].paperColor,
                        borderRadius: 10,
                        paddingHorizontal: 10
                    }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {profileForm?.dietaryRestrictions?.map(item =>
                                <Text key={uuid.v4()}
                                    style={{
                                        paddingLeft: 5,
                                        textAlignVertical: 'center',
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                    }} onPress={(text) => remove(text, "dietaryRestrictions")}>
                                    {item},
                                </Text>)}
                        </ScrollView>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].FAVORITE_FOOD}:
                        </Text>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.favoriteFood}
                            onChangeText={(text) => handleChange('favoriteFood', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].FAVORITE_RESTAURANTS}:
                        </Text>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.favoriteRestaurants}
                            onChangeText={(text) => handleChange('favoriteRestaurants', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].MEAL_PREFERENCES}:
                        </Text>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.mealPreferences}
                            onChangeText={(text) => handleChange('mealPreferences', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].FOOD_INTERESTS}:
                        </Text>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.foodInterests}
                            onChangeText={(text) => handleChange('foodInterests', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        minHeight: 100,
                        maxHeight: 200,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        <Text style={{
                            width: '30%',
                            height: '100%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].ABOUT_ME}:
                        </Text>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'top',
                                borderRadius: 10,
                                padding: 10,
                                // paddingBottom: 20,
                                color: GlobalStyles[theme].fontColor,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            placeholder={trans[language].FREE_TEXT_MAX}
                            placeholderTextColor={GlobalStyles[theme].fontColor}
                            value={profileForm?.personalDescription}
                            onChangeText={text => handleChange('personalDescription', text)}
                            keyboardType="default"
                            maxLength={256}
                            multiline={true}
                        />
                        <Text style={{
                            position: "absolute",
                            bottom: 5,
                            right: 10,
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {profileForm?.personalDescription?.length}/256
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        {/* <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].INSTAGRAM}:
                        </Text> */}
                        <View style={{ width: "30%", alignItems: "center" }}>
                            <Entypo name="instagram" size={24} color={GlobalStyles[theme].fontColor} style={{ width: 40, textAlign: 'center' }} />
                        </View>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.socialMediaHandles?.instagram}
                            onChangeText={(text) => handleSocialMediaChange('instagram', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        {/* <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].TIKTOK}:
                        </Text> */}
                        <View style={{ width: "30%", alignItems: "center" }}>
                            <FontAwesome5 name="tiktok" size={24} color={GlobalStyles[theme].fontColor} style={{ width: 40, textAlign: 'center' }} />
                        </View>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.socialMediaHandles?.tiktok}
                            onChangeText={(text) => handleSocialMediaChange('tiktok', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        {/* <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].FACEBOOK}:
                        </Text> */}
                        <View style={{ width: "30%", alignItems: "center" }}>
                            <Entypo name="facebook" size={24} color={GlobalStyles[theme].fontColor} style={{ width: 40, textAlign: 'center' }} />
                        </View>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.socialMediaHandles?.facebook}
                            onChangeText={(text) => handleSocialMediaChange('facebook', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        {/* <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].PINTEREST}:
                        </Text> */}
                        <View style={{ width: "30%", alignItems: "center" }}>
                            <Entypo name="pinterest" size={24} color={GlobalStyles[theme].fontColor} style={{ width: 40, textAlign: 'center' }} />
                        </View>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.socialMediaHandles?.pinterest}
                            onChangeText={(text) => handleSocialMediaChange('pinterest', text)}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 35,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}>
                        {/* <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].BLOG}:
                        </Text> */}
                        <View style={{ width: "30%", alignItems: "center" }}>
                            <FontAwesome5 name="blogger" size={24} color={GlobalStyles[theme].fontColor} style={{ width: 40, textAlign: 'center' }} />
                        </View>
                        <TextInput
                            style={{
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                                borderRadius: 10,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}
                            value={profileForm?.socialMediaHandles?.blog}
                            onChangeText={(text) => handleSocialMediaChange('blog', text)}
                        />
                    </View>

                    <View style={{ height: 35, width: '100%', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10, marginBottom: 50 }}>
                        <Text style={{
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].GLOBAL_STATUS}:
                        </Text>
                        <SwitchButton text01={trans[language].PUBLIC} text02={trans[language].PRIVATE} show={show} setShow={setShow} />
                    </View>

                    <TouchableOpacity
                        onPress={() => saveProfileSubmit()}
                        style={{
                            borderWidth: 0.5,
                            borderRadius: 10,
                            marginBottom: 10,
                            borderColor: GlobalStyles[theme].borderColor,
                            backgroundColor: GlobalStyles[theme].yesColor,
                            // width: 100, 
                            // height: 40,
                            // paddingHorizontal: 20
                        }}>
                        <Text style={{
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            // height: '100%',
                            // width: '100%',
                            // fontWeight: '500',
                        }}>{trans[language].SAVE_PROFILE}</Text>
                    </TouchableOpacity>

                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
                        <Button title="Save profile" onPress={() => saveProfileSubmit()} />
                        <Button title="Submit profile" onPress={() => submitProfile()} />
                        <Button title="Clear profile" onPress={() => clearProfile()} />
                    </View> */}

                    <PopupModal message={redux?.auth?.message} popupModal={popupModal} />

                    {/* // Gender Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}>

                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 400,
                                padding: 35,
                                paddingTop: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 20,
                                        marginRight: 20,
                                        top: 0,
                                        right: 0
                                    }}
                                    onPress={() => {
                                        setModalVisible(false)
                                        setSearchResult([])
                                    }}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                <TextInput
                                    style={{
                                        width: 150,
                                        height: 40,
                                        backgroundColor: "white",
                                        borderRadius: 10,
                                        paddingLeft: 10,
                                        borderColor: 'black',
                                        borderWidth: 0.5,
                                    }}
                                    placeholder={trans[language].SEARCH}
                                    onChangeText={(text) => modalSearch("gender", text)}
                                />
                                <FlatList
                                    data={searchResult?.length !== 0 ? searchResult : gender}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <TouchableOpacity
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            minWidth: 150,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme].borderColor,
                                            backgroundColor: GlobalStyles[theme].buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            // fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }]}
                                            onPress={() => handleChange('gender', item.label)}
                                        >
                                            {item.label}</Text>
                                    </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.key}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* // Countries Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible2}>

                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 400,
                                padding: 35,
                                paddingTop: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 20,
                                        marginRight: 20,
                                        top: 0,
                                        right: 0
                                    }}
                                    onPress={() => {
                                        setModalVisible2(false)
                                        setSearchResult([])
                                    }}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                <TextInput
                                    style={{
                                        width: 250,
                                        height: 40,
                                        backgroundColor: "white",
                                        borderRadius: 10,
                                        paddingLeft: 10,
                                        borderColor: 'black',
                                        borderWidth: 0.5,
                                    }}
                                    placeholder={trans[language].SEARCH}
                                    onChangeText={(text) => modalSearch("country", text)}
                                />
                                <FlatList
                                    data={searchResult?.length !== 0 ? searchResult : countries}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <TouchableOpacity
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            width: 250,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme].borderColor,
                                            backgroundColor: GlobalStyles[theme].buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            // fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }]}
                                            onPress={() => handleChange('country', item.value)}
                                        >
                                            {item.value}</Text>
                                    </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.key + item.value + Math.random()}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* // CountryCode Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible3}>

                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 400,
                                padding: 35,
                                paddingTop: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 20,
                                        marginRight: 20,
                                        top: 0,
                                        right: 0
                                    }}
                                    onPress={() => {
                                        setModalVisible3(false)
                                        setSearchResult([])
                                    }}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                <TextInput
                                    style={{
                                        width: 250,
                                        height: 40,
                                        backgroundColor: "white",
                                        borderRadius: 10,
                                        paddingLeft: 10,
                                        borderColor: 'black',
                                        borderWidth: 0.5,
                                    }}
                                    placeholder={trans[language].SEARCH}
                                    onChangeText={(text) => modalSearch("countryCode", text)}
                                />
                                <FlatList
                                    data={searchResult?.length !== 0 ? searchResult : countryCodes}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <TouchableOpacity
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            width: 250,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme].borderColor,
                                            backgroundColor: GlobalStyles[theme].buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            // fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }]}
                                            onPress={() => handleChange('countryCode', item.value)}
                                        >
                                            {item.value}</Text>
                                    </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.key + item.value + Math.random()}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* // Cooking Skills Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible4}>

                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 400,
                                padding: 35,
                                paddingTop: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 20,
                                        marginRight: 20,
                                        top: 0,
                                        right: 0
                                    }}
                                    onPress={() => {
                                        setModalVisible4(false)
                                        setSearchResult([])
                                    }}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                {/* <TextInput
                                    style={{
                                        width: 250,
                                        height: 40,
                                        backgroundColor: "white",
                                        borderRadius: 10,
                                        paddingLeft: 10,
                                        borderColor: 'black',
                                        borderWidth: 0.5,
                                    }}
                                    placeholder={trans[language].SEARCH}
                                    onChangeText={(text) => modalSearch("countryCode", text)}
                                /> */}
                                <FlatList
                                    data={searchResult?.length !== 0 ? searchResult : cookingSkills}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <TouchableOpacity
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            width: 250,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme].borderColor,
                                            backgroundColor: GlobalStyles[theme].buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            // fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }]}
                                            onPress={() => handleChange('cookingSkills', item.value)}
                                        >
                                            {item.value}</Text>
                                    </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.key + item.value + Math.random()}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* // Dietary Restrictions Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible5}>

                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 400,
                                padding: 35,
                                paddingTop: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 20,
                                        marginRight: 20,
                                        top: 0,
                                        right: 0
                                    }}
                                    onPress={() => {
                                        setModalVisible5(false)
                                        setSearchResult([])
                                    }}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                <TextInput
                                    style={{
                                        width: 250,
                                        height: 40,
                                        backgroundColor: "white",
                                        borderRadius: 10,
                                        paddingLeft: 10,
                                        borderColor: 'black',
                                        borderWidth: 0.5,
                                    }}
                                    placeholder={trans[language].SEARCH}
                                    onChangeText={(text) => modalSearch("dietaryRestrictions", text)}
                                />
                                <FlatList
                                    data={searchResult?.length !== 0 ? searchResult : dietaryRestrictions}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <TouchableOpacity
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            width: 250,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme].borderColor,
                                            backgroundColor: GlobalStyles[theme].buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            // fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }]}
                                            onPress={() => handleChange('dietaryRestrictions', item.value)}
                                        >
                                            {item.value}</Text>
                                    </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.key + item.value + Math.random()}
                                />
                            </View>
                        </View>
                    </Modal>

                </View>
            </ScrollView >
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
})