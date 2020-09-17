import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LandingPage from './screens/LandingPage'
import CreateToDoList from './components/CreateToDoList'
import ToDoList from './components/TodoList'
import Database from './services/Database'
import 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const Stack = createStackNavigator();

export default class App extends Component {

  constructor() {
    Database.init();
    super();
  }

  createHomeStack = () =>
    <Stack.Navigator>
      <Stack.Screen name='Create ToDo' component={LandingPage} />
    </Stack.Navigator>

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LandingPage">
          <Stack.Screen name="Create ToDo" component={LandingPage} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
