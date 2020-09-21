import React, { Component } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import CreateToDoList from '../../components/CreateToDoList';
import ToDoList from '../../components/TodoList';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from 'react-native-reanimated';


const shortid = require('shortid');
const Tab = createBottomTabNavigator()

export default class LandingPage extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Tab.Navigator activeColor="#000"
            style={{ backgroundColor: '#fff' }} initialRouteName="CreateToDoList">

            <Tab.Screen
               name="Home"
               component={CreateToDoList}
               options={{
                  tabBarIcon: ({ color }) => (
                     <MaterialCommunityIcons name='home' color={color} size={26} />
                  ),
               }}
            />
            <Tab.Screen
               name="Completed Tasks"
               component={ToDoList}
               options={{
                  tabBarIcon: ({ color }) => (
                     <MaterialCommunityIcons name='view-list' color={color} size={26} />
                  ),
               }}
            />
         </Tab.Navigator>
      )
   }
}