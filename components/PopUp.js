import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Root, SPSheet, Popup } from 'react-native-popup-confirm-toast'

import React from 'react'

const PopUp = ({ message, type }) => {
    //hook or class 
    console.log(message);

    return (
        <Root>
            <View>
                <TouchableOpacity
                    onPress={() =>
                        Popup.show({
                            type: { type },
                            title: { message },
                            // textBody: 'Body ',
                            // buttonText: 'Confirm',
                            callback: () => Popup.hide()
                            // title:	            //string		false
                            // textBody:	        //string		false
                            // bodyComponent:	    //component(hook or class)	custom modal component container	null
                            // bodyComponentForce:	//boolean	The component you specify covers the entire space	false
                            // onLayout:	        //function	which triggers this feature for us to automatically calculate the height of the component area you specify.	
                            // type:	            //enum	enum(success, danger, warning, confirm)	warning
                            // buttonText:	        //string		Ok
                            // confirmText:	        //string		Cancel
                            // callback:	        //function	ok button press	popupHidden
                            // cancelCallback:	    //function	cancel button press	popupHidden
                            // background:	        //string		rgba(0, 0, 0, 0.5)
                            // timing:	            //number	0 > autoClose	0
                            // iconEnabled:	        //boolean		true
                            // iconHeaderStyle:	    //object		{height: 75, width: 100, backgroundColor: '#fff'}
                            // icon	requireUrl:		//require('../assets/{type}.png')
                            // containerStyle:	    //object		{ position: 'absolute', zIndex: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', top: 0, left: 0,}
                            // modalContainerStyle:	//object		{ width: '90%',backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', overflow: 'hidden', position: 'absolute'}}
                            // buttonContentStyle:	//object		{}
                            // okButtonStyle:	    //object		{backgroundColor: '#702c91'}
                            // confirmButtonStyle:	//object		default
                            // okButtonTextStyle:	//object		default
                            // confirmButtonTextStyle:	//object		default
                            // titleTextStyle:	    //object		default
                            // descTextStyle:	    //object		default
                            // bounciness:	        //number		15
                            // onClose:	            //function	when the popup is first closed	false
                            // onCloseComplete:	    //function		false
                            // onOpen:	            //function	when the popup is first opened	false
                            // onOpenComplete:	    //function		false
                            // duration:	        //boolean		100
                            // closeDuration:	    //boolean		100
                        })
                    }
                >
                    <Text>Open Popup Message</Text>
                </TouchableOpacity>
            </View>
        </Root >);

    //props.spSheet.hide();
    //props.spSheet.setHeight(150,()=>alert('nice'));
}

<Root>
    <View>
        <TouchableOpacity
            onPress={() => {
                const spSheet = SPSheet;
                spSheet.show({
                    component: () => component({ ...this.props, spSheet }),
                    dragFromTopOnly: true,
                    onCloseComplete: () => {
                        alert('onCloseComplete');
                    },
                    onOpenComplete: () => {
                        alert('onOpenComplete');
                    },
                    height: 260
                });
            }}
        >
            <Text>Open Popup Message</Text>
        </TouchableOpacity>
    </View>
</Root>

export default PopUp

const styles = StyleSheet.create({})