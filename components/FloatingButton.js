import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import {
    AntDesign, Entypo, Feather, FontAwesome, MaterialCommunityIcons
} from '@expo/vector-icons';

const FloatingButton = (props) => {
    const Animation = new Animated.Value(0);
    const [toValue, setToValue] = useState(1)

    const buttonSpringAnimationValue = React.useRef(new Animated.Value(0)).current;
    // const button01AnimationValue = React.useRef(new Animated.Value(0)).current;
    // const button02AnimationValue = React.useRef(new Animated.Value(0)).current;
    // const button03AnimationValue = React.useRef(new Animated.Value(0)).current;
    // const button04AnimationValue = React.useRef(new Animated.Value(0)).current;
    // const button05AnimationValue = React.useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        Animated.spring(buttonSpringAnimationValue, {
            toValue: toValue,
            friction: 5,
            useNativeDriver: true
        }).start();

        // Animated.spring(button01AnimationValue, {
        //   toValue,
        //   friction: 5,
        //   duration: 8000,
        // }).start();

        // Animated.sequence([
        //   Animated.delay(200),
        //   Animated.timing(button01AnimationValue, {
        //     toValue: 1,
        //     duration: 600,
        //     useNativeDriver: true,
        //   }),
        //   Animated.delay(200),
        //   Animated.timing(button02AnimationValue, {
        //     toValue: 1,
        //     duration: 600,
        //     useNativeDriver: true,
        //   }),
        //   Animated.delay(200),
        //   Animated.timing(button03AnimationValue, {
        //     toValue: 1,
        //     duration: 600,
        //     useNativeDriver: true,
        //   }),
        //   Animated.delay(200),
        //   Animated.timing(button04AnimationValue, {
        //     toValue: 1,
        //     duration: 600,
        //     useNativeDriver: true,
        //   }),
        //   Animated.delay(200),
        //   Animated.timing(button05AnimationValue, {
        //     toValue: 1,
        //     duration: 600,
        //     useNativeDriver: true,
        //   }),
        // ]).start();
        // .start(({finished}) => {
        //   if(finished){
        //     box1AnimationValue.setValue(0);
        //     box2AnimationValue.setValue(0);
        //   }
        // })

        setToValue((toValue) => toValue === 0 ? setToValue(1) : setToValue(0))
    };

    const style05 = {
        transform: [
            {
                scale: buttonSpringAnimationValue,
            },
            {
                translateX: buttonSpringAnimationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 100],
                }),
            },
        ],
    };

    const style04 = {
        transform: [
            {
                scale: buttonSpringAnimationValue,
            },
            {
                translateY: buttonSpringAnimationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70],
                }),
            },
            {
                translateX: buttonSpringAnimationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 70],
                }),
            },
        ],
    };

    const style03 = {
        transform: [
            {
                scale: buttonSpringAnimationValue,
            },
            {
                translateY: buttonSpringAnimationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                }),
            },
        ],
    };

    const style02 = {
        transform: [
            {
                scale: buttonSpringAnimationValue,
            },
            {
                translateY: buttonSpringAnimationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70],
                }),
            },
            {
                translateX: buttonSpringAnimationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70],
                }),
            },
        ],
    };

    const style01 = {
        transform: [
            {
                scale: buttonSpringAnimationValue,
            },
            {
                translateX: buttonSpringAnimationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                }),
            },
        ],
    };

    const rotation = {
        transform: [
            {
                rotate: buttonSpringAnimationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                }),
            },
        ],
    };

    return (
        <View style={[styles.container, props.style]}>
            <TouchableWithoutFeedback onPress={props.deleteAlert}>
                <Animated.View style={[styles.button, styles.secondary, style05]}>
                    <AntDesign name="delete" size={25} color="red" />
                </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={props.createShopList}>
                <Animated.View style={[styles.button, styles.secondary, style04]}>
                    <FontAwesome name="list" size={25} color="red" />
                </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
                <Animated.View style={[styles.button, styles.secondary, style03]}>
                    <Entypo name="plus" size={25} color="red" />
                </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={props.editRecipe}>
                <Animated.View style={[styles.button, styles.secondary, style02]}>
                    <Feather name="edit-3" size={25} color="red" />
                </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={props.openAddTo}>
                <Animated.View style={[styles.button, styles.secondary, style01]}>
                    <MaterialCommunityIcons name="playlist-plus" size={25} color="red" />
                </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => toggleMenu()}>
                <Animated.View style={[styles.button, styles.menu, rotation]}>
                    <Entypo name="plus" size={40} color="white" />
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
}

export default FloatingButton

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // position: 'absolute',
    },
    button: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        // alignContent: 'center',
        justifyContent: 'center',
        shadowRadius: 10,
        shadowColor: '#F02A4B',
        shadowOpacity: 1,
        shadowOffset: { height: 100 },
        elevation: 7,
        zIndex: 7
    },
    menu: {
        backgroundColor: '#F02A4B',
    },
    secondary: {
        backgroundColor: 'white',
        width: 40,
        height: 40,
    },
});
