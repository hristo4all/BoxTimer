import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../utils/colors'

export default function AppButton({ onPress, icon, title, backgroundColor, borderRadius, fontSize }) {
    return (
        <TouchableOpacity style={styles.container}>
            <Icon.Button
                name={icon}
                borderRadius={borderRadius}
                backgroundColor={backgroundColor}
                onPress={onPress}
                style={styles.appButton}
            >
                <Text style={[styles.appButtonText, fontSize = { fontSize }]}>{title}</Text>
            </Icon.Button>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    appButton: {
        padding: 12,
    },
    appButtonText: {
        color: colors.textSecondary
    },
    container: {
        margin: 5,
        justifyContent: 'center',
        alignItems: "center",
        alignContent: "center",

    }
});
