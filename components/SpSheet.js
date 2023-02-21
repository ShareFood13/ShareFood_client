import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Root, SPSheet } from 'react-native-popup-confirm-toast'

import React from 'react'

const SpSheet = ({ text, children, heightValue }) => {

    const TestComp = () => {
        return (
            children
        )
    }
    return (
        <Root>
            <View>
                <TouchableOpacity
                    style={styles.genericButton}
                    onPress={() => {
                        const spSheet = SPSheet;
                        spSheet.show({
                            component: () => TestComp(),
                            dragTopOnly: true,
                            height: heightValue,
                            keyboardHeightAdjustment: true//boolean	re-adjusts the height when the keyboard is opened	false
                            // background: 	        //string	'red',rgba(0, 0, 0, 0.5)
                            // height:	            //number	auto height (min: 250)	250
                            // duration:	        //number	animation time used when opening	250(ms)
                            // closeDuration:	    //number	animation time used when closing	300(ms)
                            // closeOnDragDown:	    //boolean	Use drag with motion to close the window	true
                            // closeOnPressMask:    //boolean	press the outside space to close the window	true
                            // closeOnPressBack:	//boolean	Press the back key to close the window (Android only)	true
                            // dragTopOnly:	        //boolean	use only the top area of the draggable icon to close the window	false
                            // component:	        //component(hook or class)	custom modal component container	null
                            // onOpen:	            //function	works after the window is opened	null
                            // onOpenComplete:	    //function	works after the window is opened	null
                            // onClose:	            //function	works after window is closed	null
                            // onCloseComplete:	    //function	works after window is closed	null
                            // customStyles:	    //object	customStyles: { draggableIcon: {}, container: {}, draggableContainer:{} }	{}
                            // timing:	            //number	Use this parameter for automatic shutdown.	0(ms)
                        });
                    }}
                >

                    <Text style={{ color: 'black', fontWeight: '500' }}>{text}</Text>
                </TouchableOpacity>
            </View>
        </Root>
    )
}

export default SpSheet

const styles = StyleSheet.create({
    genericButton: {
        marginBottom: 10,
        width: 190,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: '#66ccff',

    },
})