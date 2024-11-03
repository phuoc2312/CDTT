import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import MyTab from './MyTab'
import { NavigationContainer } from '@react-navigation/native';

const Home = () => {
    return (
        <NavigationContainer independent={true}>
            <MyTab />
        </NavigationContainer>
    )
}

export default Home

const styles = StyleSheet.create({})