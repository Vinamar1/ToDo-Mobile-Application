import React, { Component } from 'react';
import Database from '../../services/Database';

import { Modal, Switch, Platform, ImageBackground, Text, View, FlatList, DatePickerAndroid, TextInput, TimePickerAndroid, List, TouchableOpacity, Body, StyleSheet, ScrollView, Alert, RefreshControl, Dimensions, Image, KeyboardAvoidingView } from 'react-native';
import { Content, ListItem, Left, Icon } from 'native-base';
import * as _ from 'lodash';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Searchbar from '../Searchbar/index';
// import { Modal } from 'react-native-paper';
import Time from '../Time';
import moment from 'moment';
import { color } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressCircle from 'react-native-progress-circle'


export default class ToDoList extends Component {
   constructor(props) {
      super(props);
   }
   state = {
      listOfTasks: [],
      error: undefined,
      taskName: undefined,
      taskDesc: undefined,
      taskCreatedAt: undefined,
      id: undefined,
      _taskCreatedAt: undefined,
      status: undefined,
      completedTasks: false,
      newList: [],
      refresh: false,
      searchedTask: [],
      allData: [],
      searchBarActive: false,
      taskModalVisible: false,
      taskCategory: undefined,
      icon: undefined,
      switchValue: false,
      iconFont: undefined,
      colorCode: undefined,
      todayDate: undefined,
      todayMonth: undefined,
      todayDayYear: undefined,
      taskUpdateModalVisible: false,
      progressBarPercentage: 0,
   }

   onRefresh = () => {
      this.setState({ refresh: true }, () => {
         this.getData()
      })
   };
   completeTaskProgressBar = () => {
      const { newList, progressBarPercentage } = this.state;
      let newListLength = newList.length;
      let completedNewList = newList.filter(item => {
         if (newList.completedTasks === 'true') {
            return (
               newList.completedTasks
            );
         }
      })
      let completedListLength = completedNewList.length;
      let calculatedPercentage = ((completedListLength / newListLength) * 100);
      console.log('%p', calculatedPercentage);
      this.setState({
         progressBarPercentage: calculatedPercentage
      }, () => {
         console.log(this.state.progressBarPercentage);
      })
   }

   componentDidMount = async => {
      this.getData()
   }

   getData = async () => {
      const { id, taskName, taskCreatedAt, completedTasks, refresh, todayDate, todayDayYear, todayMonth } = this.state;
      let d = new Date();
      let n = d.getDate();
      let y = d.getFullYear();
      let m = d.getMonth() + 1;

      const monthNames = ["January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"
      ];
      let month = monthNames[d.getMonth()]
      this.setState({
         todayDate: n,
         todayDayYear: y,
         todayMonth: month
      })

      let response = await Database.select('saved_task');
      console.log('RESULTTODO', response)
      this.setState({
         newList: response.rows._array
      }, () => {
         // console.log('newlist', this.state.newList)
      })
   }

   render() {
      const { completedTasks, newList,todayDate, todayDayYear, todayMonth,progressBarPercentage } = this.state
      console.log('UditKhar', newList)
      let _newList = newList.filter(item => item.completedTasks == 'true')
      console.log('Fullcompleted', _newList)
      return (
         <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ImageBackground source={require(`../../assets/bg3.jpg`)} style={{ flex: 1 }}>
               <View style={{ flex: 1, }}>
               <View style={{ padding: 10 }}>
                     <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 30, flex: 1, color: '#fff' }}>
                           {todayDate}th
                        </Text>
                        <Text style={{ fontSize: 18, flex: 1.3, color: '#fff', alignSelf: 'center', justifyContent: 'center' }}>
                           {todayMonth} {todayDayYear}
                        </Text>
                        <View style={{ flex: 0.8, marginLeft: 110 }}>
                           <ProgressCircle
                              percent={progressBarPercentage.toFixed(0)}
                              radius={25}
                              borderWidth={4}
                              color="#00b300"
                              shadowColor="#ccc"
                              bgColor="#fff">
                              <Text style={{ fontSize: 12, }}>{progressBarPercentage.toFixed(0)}%</Text>
                           </ProgressCircle>
                        </View>

                     </View>
                     <Text style={{ marginTop: 10, color: '#fff' }}>
                        Where there is life there is hope.
                  </Text>
                  </View>
                  <FlatList
                     data={_newList}
                     onRefresh={() => this.onRefresh()}
                     refreshing={this.state.refresh}
                     keyExtractor={item => item.name}
                     horizontal={false}
                     initialNumToRender={8}
                     renderItem={({ item }) => {
                        return (
                           <View style={{
                              flexDirection: 'row',
                              flex: 1,
                              marginTop: 20,
                              paddingTop: 15,
                              paddingBottom: 15,
                              backgroundColor: '#fff', borderRadius: 10, marginLeft: 7, marginRight: 7
                           }}>
                              <TouchableOpacity
                                 // onPress={() => this.openTaskUpdateModal(item)}
                                 style={{ flexDirection: 'row', flex: 1 }}>
                                 <View style={{ backgroundColor: `${item.colorCode}`, borderRadius: 25, flex: 0.4, padding: 7, justifyContent: 'center', alignSelf: 'center', marginLeft: 7 }}>
                                    {/* <Icon style={{ padding: 80, alignContent: 'center', alignSelf: 'center' }} type='MaterialIcons' name='directions-run' style={{ color: '#000' }} /> */}
                                    <Icon style={{ padding: 80, alignContent: 'center', alignSelf: 'center' }} type={item.iconFont} name={item.icon} style={{ color: '#fff' }} />
                                 </View>
                                 <View style={{ flex: 3, marginLeft: 10, alignSelf: 'center' }}>
                                    <Text style={{ color: '#000', fontWeight: 'bold', }}>
                                       {item.taskName}
                                    </Text>
                                    <Text style={{ color: '#A9A9A9' }}>
                                       {item.taskDesc}
                                    </Text>
                                 </View>
                                 <View style={{ flex: 1, alignSelf: 'center', }}>
                                    <Text style={{ marginRight: 3, marginLeft: 10, color: '#A9A9A9', fontWeight: 'bold' }}>{item.taskCreatedAt}</Text>
                                 </View>
                              </TouchableOpacity>
                           </View>

                        )
                     }}
                  >

                  </FlatList>
               </View >
            </ImageBackground>
         </View>
      )
   }
}


