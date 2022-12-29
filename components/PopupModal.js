import { StyleSheet, Text, View, Modal } from 'react-native'
import React from 'react'

const PopupModal = ({ thumbs, message, popupModal }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={popupModal}
        >
            <View style={{ flex: 1, top: 550, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', backgroundColor: 'white', width: '90%', height: 100, justifyContent: 'center', alignItems: 'center', alignContent: 'center', borderColor: 'black', borderWidth: 1, borderStyle: 'solid', borderRadius: 20 }}>
                    {message === "Recipe Created!!!" ? <><Text style={{ width: 50, height: 50, fontSize: 30 }}>👍</Text><Text style={{ fontSize: 24 }}>{message}</Text></>
                        : <><Text style={{ width: 50, height: 50, fontSize: 30 }}>👎 </Text><Text style={{ fontSize: 24 }}>Something went wrong</Text></>}

                </View>
            </View>
        </Modal>
    )
}

export default PopupModal

const styles = StyleSheet.create({})