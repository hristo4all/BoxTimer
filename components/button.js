import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../utils/colors'

export default function AppButton({ onPress, icon, title, backgroundColor, iconColor, borderRadius, fontSize, height, width }) {
    return (
        <TouchableOpacity style={styles.container}>
            <Icon.Button
                name={icon}
                borderRadius={borderRadius}
                backgroundColor={backgroundColor}
                onPress={onPress}
                color={iconColor}
                style={[styles.appButton, width = { width }, height = { height }]}
            >
                <Text style={[styles.appButtonText, fontSize = { fontSize }]}>{title}</Text>
            </Icon.Button>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    appButton: {
        paddingLeft: 15,

    },
    appButtonText: {
        color: colors.white,
    },
    container: {
        margin: 5,
    }
});
