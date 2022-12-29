import { Root, Toast } from 'react-native-popup-confirm-toast'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const ToastComp = ({ show }) => {
    return (
        <Root>
            <View>
                <TouchableOpacity
                    onPress={() =>
                        Toast.show({
                            title: 'Hey!',
                            text: 'The best gift I received in this life are the codes. They are worlds inside the worlds.',
                            backgroundColor: '#702c91',
                            timeColor: '#440f5f',
                            timing: 1500,
                            position: 'top' //top, bottom
                            // icon: <Icon name={'check'} color={'#fff'} size={31} />,
                            // title:	        //string		false
                            // text:            //string	Description	false
                            // titleTextStyle:	//object		{color: '#fff',fontWeight: 'bold',fontSize: 16}
                            // descTextStyle:	//object		{marginTop: 5,fontSize: 13,color: '#fff', fontWeight: '400',}
                            // backgroundColor:	//string		#1da1f2
                            // timeColor:	    //string	time backgroundColor	#1c6896
                            // position:        //enum	parameters => top, bottom	bottom
                            // icon:            //component	(react-native-vector-icons or  component)	null
                            // timing:	        //number		5000 ms
                            // statusBarHidden:	//boolean		false
                            // hiddenDuration:	//number		200 ms
                            // startDuration:	//number		200 ms
                        })
                    }
                >
                    <Text>Open Toast</Text>
                </TouchableOpacity>
            </View>
        </Root>
    )
}

export default ToastComp

const styles = StyleSheet.create({})

