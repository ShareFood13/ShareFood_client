import React, { useState, useEffect, useCallback, useContext } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { useIsFocused } from '@react-navigation/native';
import { Context } from "../../context/UserContext";

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
    Alert,
    FlatList,
    RefreshControl,
    ImageBackground
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, FontAwesome } from '@expo/vector-icons';

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

export default MyProfile = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const { userContext, setUserContext } = useContext(Context)

    const [profileForm, setProfileForm] = useState();
    const [userData, setUserData] = useState();
    const [show, setShow] = useState("Public")
    const [refreshing, setRefreshing] = useState(false)
    const [popupModal, setPopupModal] = useState(false)


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
            if (item.idd.suffixes !== undefined) {
                countries.push({
                    key: i,
                    value: item.name.common,
                    // code: item.altSpellings[0] + " " + item.idd.root + item.idd.suffixes[0]
                })
            }
        })
        sortList.forEach((item, i) => {
            if (item.idd.suffixes !== undefined) {
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

    return (
        <ScrollView style={{
            width: windowWidth, height: windowHeight,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: 'black',
        }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh()}
                />}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                <Banner title="My Profile" />

                <ImageBackground
                    // source={require('../../assets/images/menu-bg.jpeg')}
                    // source={{ uri: redux?.auth?.authData?.result?.profile?.backgroundPicture }}
                    // source={userContext?.backgroundPicture ? { uri: userContext?.backgroundPicture } : require('../../assets/images/menu-bg.jpeg')}
                    source={{ uri: profileForm?.backgroundPicture?.base64 }}
                    style={{ marginBottom: 10, width: '100%', height: 150, alignSelf: 'center', justifyContent: 'center', borderColor: 'black', borderWidth: 0.5 }}>
                    <Image
                        // source={require("../../assets/images/user-profile.jpeg")}
                        // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                        // source={userContext?.profilePicture ? { uri: userContext?.profilePicture } : require("../../assets/images/user-profile.jpeg")}
                        source={{ uri: profileForm?.profilePicture?.base64 }}
                        style={{ height: 90, width: 90, borderRadius: 45, marginLeft: 30, borderColor: 'black', borderWidth: 0.5 }}
                    />
                    <TouchableOpacity onPress={() => pickImageAsync('profilePicture')} style={{ flexDirection: 'row', position: 'absolute', zIndex: 5, elevation: 5, left: 90, top: 90 }}>
                        <FontAwesome name="camera-retro" size={30} color="black" style={{ width: 32, height: 30, textAlign: 'center', backgroundColor: 'white' }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImageAsync('backgroundPicture')} style={{ flexDirection: 'row', position: 'absolute', zIndex: 5, elevation: 5, right: 20, top: 110 }}>
                        <FontAwesome name="camera-retro" size={30} color="black" style={{ width: 32, height: 30, textAlign: 'center', backgroundColor: 'white' }} />
                    </TouchableOpacity>
                </ImageBackground>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                    <Text>Name:</Text>
                    <Text style={{ width: '33%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}>
                        {profileForm?.name?.split(" ")[0]}</Text>
                    {/* {userContext?.name?.split(" ")[0]}</Text> */}
                    {/* <TextInput
                        style={{ width: '33%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        // value={profileForm?.name}
                        defaultValue={profileForm?.name?.split(" ")[0]}
                        onChangeText={(text) => handleChange('name', text)}
                    /> */}
                    <Text>Surname:</Text>
                    <Text style={{ width: '33%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}>
                        {profileForm?.name?.split(" ")[1]}</Text>
                    {/* {userContext?.name?.split(" ")[1]}</Text> */}
                    {/* <TextInput
                        style={{ width: '33%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        // value={profileForm?.surname}
                        defaultValue={profileForm?.name?.split(" ")[1]}
                        onChangeText={(text) => handleChange('surname', text)}
                    /> */}
                </View>

                {/* {!redux?.auth?.authData?.result?.profile?.birthDate ? */}
                {!userContext?.birthDate ?
                    < DatePicker
                        pickerType="date"
                        // setInfoPicked={setInfoPicked}
                        infoPickerFunction={infoPickerFunction}
                        formTypeInput="birthDate"
                        birthDay="true"
                    />
                    : <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ width: '30%' }}>BirthDate:</Text>
                        <Text style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}>
                            {profileForm?.birthDate}</Text>
                    </View>
                }

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>UserName:</Text>
                    <Text style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}>
                        {userData?.userUserName}</Text>
                    {/* {userContext?.userName}</Text> */}
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>E-mail:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        // value={profileForm?.email}
                        // defaultValue={userData?.userEmail}
                        defaultValue={profileForm?.email}
                        onChangeText={(text) => handleChange('email', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                    <Text style={{ width: '17%' }}>Address:</Text>
                    <TextInput
                        keyboardType='ascii-capable'
                        style={{ width: '69%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.fullAddress?.address}
                        onChangeText={(text) => handleChange('address', text)}
                    />
                    {/* <Text>Number:</Text> */}
                    <TextInput
                        placeholder='num'
                        keyboardType='numeric'
                        style={{ width: '12%', height: '100%', textAlignVertical: 'center', paddingHorizontal: 5, backgroundColor: 'white', borderRadius: 10 }}
                        value={profileForm?.fullAddress?.addNumber}
                        onChangeText={(text) => handleChange('addNumber', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                    <Text style={{ width: '15%' }}>Country:</Text>
                    <SelectList
                        setSelected={(val) => handleChange('country', val)}
                        data={countries}
                        placeholder={profileForm?.fullAddress?.country ? profileForm?.fullAddress?.country : "Country"}
                        save="value"
                        boxStyles={{
                            width: 140,
                            borderWidth: 0,
                            borderBottomWidth: 2,
                            borderStyle: 'solid',
                            borderColor: 'black',
                        }}
                        dropdownItemStyles={{
                            width: 300,
                            marginBottom: 10,
                        }}
                        dropdownStyles={{
                            width: windowWidth * 0.80,
                            backgroundColor: 'white',
                            position: 'absolute',
                            elevation: 10,
                            zIndex: 10,
                            top: 40,
                            left: -25
                        }}
                    />
                    <Text style={{ width: '20%' }}>ZIP Code:</Text>
                    <TextInput
                        keyboardType='numeric'
                        style={{ width: '25%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.fullAddress?.zipCode}
                        onChangeText={(text) => handleChange('zipCode', text)}
                    />
                </View>

                <View style={{ width: '90%', height: 30, justifyContent: 'flex-end' }}>
                    <Text style={{ width: '30%' }}>Phone Number:</Text>
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <SelectList
                        setSelected={(val) => handleChange('countryCode', val)}
                        data={countryCodes}
                        placeholder={profileForm?.phone?.countryCode ? profileForm?.phone?.countryCode : "Country Code"}
                        save="value"
                        boxStyles={{
                            width: 150,
                            borderWidth: 0,
                            borderBottomWidth: 2,
                            borderStyle: 'solid',
                            borderColor: 'black',
                        }}
                        dropdownItemStyles={{
                            width: 150,
                            marginBottom: 10,
                        }}
                        dropdownStyles={{
                            // width: windowWidth * 0.80,
                            width: 150,
                            backgroundColor: 'white',
                            position: 'absolute',
                            elevation: 10,
                            zIndex: 10,
                            top: 40,
                            // left: -25
                        }}
                    />
                    <TextInput
                        keyboardType='numeric'
                        style={{ width: '57.5%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.phone?.phoneNumber}
                        onChangeText={(text) => handleChange('phoneNumber', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>Profession:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.profession}
                        onChangeText={(text) => handleChange('profession', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 10 }}>
                    <Text style={{ width: 50 }}>Skills: </Text>
                    <SelectList
                        setSelected={(val) => handleChange('cookingSkills', val)}
                        data={cookingSkills}
                        placeholder={profileForm?.cookingSkills ? profileForm?.cookingSkills : "Cooking Skills"}
                        save="value"
                        boxStyles={{
                            width: 300,
                            borderWidth: 0,
                            borderBottomWidth: 2,
                            borderStyle: 'solid',
                            borderColor: 'black',
                        }}
                        dropdownItemStyles={{
                            width: 250,
                            marginBottom: 10,
                        }}
                        dropdownStyles={{
                            width: windowWidth * 0.75,
                            alignSelf: 'center',
                            backgroundColor: 'white',
                            position: 'absolute',
                            elevation: 10,
                            zIndex: 10,
                            top: 40
                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 10 }}>
                    <Text style={{ width: 50 }}>Gender: </Text>
                    <SelectList
                        setSelected={(val) => handleChange('gender', val)}
                        data={gender}
                        placeholder={profileForm?.gender}
                        save="value"
                        boxStyles={{
                            width: 300,
                            borderWidth: 0,
                            borderBottomWidth: 2,
                            borderStyle: 'solid',
                            borderColor: 'black',
                        }}
                        dropdownItemStyles={{
                            width: 250,
                            marginBottom: 10,
                        }}
                        dropdownStyles={{
                            width: windowWidth * 0.75,
                            alignSelf: 'center',
                            backgroundColor: 'white',
                            position: 'absolute',
                            elevation: 10,
                            zIndex: 10,
                            top: 40
                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 10 }}>
                    <Text style={{ width: 50 }}>Diet: </Text>
                    <SelectList
                        setSelected={(val) => handleChange('dietaryRestrictions', val)}
                        data={dietaryRestrictions}
                        placeholder="Dietary Restrictions"
                        save="value"
                        boxStyles={{
                            width: 300,
                            borderWidth: 0,
                            borderBottomWidth: 2,
                            marginBottom: 10,
                            borderStyle: 'solid',
                            borderColor: 'black',
                        }}
                        dropdownItemStyles={{
                            width: 250,
                            marginBottom: 10,
                        }}
                        dropdownStyles={{
                            width: windowWidth * 0.75,
                            alignSelf: 'center',
                            backgroundColor: 'white',
                            position: 'absolute',
                            elevation: 10,
                            zIndex: 10,
                            top: 40
                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignContent: 'center', marginVertical: 10, backgroundColor: 'white', borderRadius: 10 }}>
                    {profileForm?.dietaryRestrictions?.map(item => <Text key={uuid.v4()} style={{ paddingLeft: 5, textAlignVertical: 'center' }} onPress={(text) => remove(text, "dietaryRestrictions")}>{item},</Text>)}
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>Favorite Food:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.favoriteFood}
                        onChangeText={(text) => handleChange('favoriteFood', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>Favorite Restaurants:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.favoriteRestaurants}
                        onChangeText={(text) => handleChange('favoriteRestaurants', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>Meal Preferences:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.mealPreferences}
                        onChangeText={(text) => handleChange('mealPreferences', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>Food Interests:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.foodInterests}
                        onChangeText={(text) => handleChange('foodInterests', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', minHeight: 100, maxHeight: 200, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%', height: '100%' }}>About me:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'top', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5, paddingBottom: 20 }}
                        placeholder='Free Text max 256 char.'
                        value={profileForm?.personalDescription}
                        onChangeText={text => handleChange('personalDescription', text)}
                        keyboardType="default"
                        maxLength={256}
                        multiline={true}
                    />
                    <Text style={{ position: "absolute", bottom: 0, right: 0 }}>{profileForm?.personalDescription?.length}/256</Text>
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>Instagram:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.socialMediaHandles?.instagram}
                        onChangeText={(text) => handleSocialMediaChange('instagram', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>TikTok:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.socialMediaHandles?.tiktok}
                        onChangeText={(text) => handleSocialMediaChange('tiktok', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>FaceBook:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.socialMediaHandles?.facebook}
                        onChangeText={(text) => handleSocialMediaChange('facebook', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>Pinterest:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.socialMediaHandles?.pinterest}
                        onChangeText={(text) => handleSocialMediaChange('pinterest', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={{ width: '30%' }}>Blog:</Text>
                    <TextInput
                        style={{ width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}
                        value={profileForm?.socialMediaHandles?.blog}
                        onChangeText={(text) => handleSocialMediaChange('blog', text)}
                    />
                </View>

                <View style={{ height: 35, width: '90%', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 10, marginBottom: 40 }}>
                    <Text> Data Status:</Text>
                    <SwitchButton text01="Public" text02="Private" show={show} setShow={setShow} />
                </View>

                <TouchableOpacity onPress={() => saveProfileSubmit()} style={{ width: 100, height: 40, borderColor: 'black', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
                    <Text style={{ textAlignVertical: 'center', height: '100%', width: '100%', textAlign: 'center' }}>Save profile</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
                    <Button title="Save profile" onPress={() => saveProfileSubmit()} />
                    <Button title="Submit profile" onPress={() => submitProfile()} />
                    <Button title="Clear profile" onPress={() => clearProfile()} />
                </View>

                <PopupModal message={redux?.auth?.message} popupModal={popupModal} />

            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
})