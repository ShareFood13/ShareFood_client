import React, { useState } from 'react'
import { StyleSheet, Text, View, Modal, Dimensions } from 'react-native'
import GlobalStyles from '../GlobalStyles'

const windowHeight = Dimensions.get("window").height


const PopupModal = ({ message, popupModal }) => {
    const [theme, setTheme] = useState("stylesLight")

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={popupModal}
        >
            <View style={{ flex: 1, top: windowHeight * 0.75, alignItems: 'center' }}>
                <View style={{
                    flexDirection: 'row',
                    width: '90%',
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    borderColor: 'black',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: 20,
                    backgroundColor: GlobalStyles[theme].paperColor,
                }}>
                    <Text style={{ fontSize: 20 }}>{message}</Text>
                </View>
            </View>
        </Modal>
    )
}

export default PopupModal

const styles = StyleSheet.create({})