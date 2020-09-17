import React, { Component } from 'react';
import { Modal, Switch, Platform, ImageBackground, Text, View, FlatList, DatePickerAndroid, TextInput, TimePickerAndroid, List, TouchableOpacity, Body, StyleSheet, ScrollView, Alert, RefreshControl, Dimensions, Image, KeyboardAvoidingView } from 'react-native';
import { Content, ListItem, Left, Icon } from 'native-base';
import Database from '../../services/Database';
import * as _ from 'lodash';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Searchbar from '../Searchbar/index';
// import { Modal } from 'react-native-paper';
import Time from '../Time';
import moment from 'moment';
import { color } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const shortid = require('shortid');

export default class CreateToDoList extends Component {

   constructor(props) {
      super(props);
      this.deleteItem = this.deleteItem.bind(this);
      // this.addItem = this.addItem.bind(this);
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
      todayDayYear: undefined
   }

   onRefresh = () => {
      this.setState({ refresh: true }, () => {
         this.getData()
      })
   };

   componentDidMount = async () => {
      this.getData();
      this.getTodayDate();
   }

   getTodayDate = async () => {
      const { todayDate, todayDayYear, todayMonth } = this.state
      let d = new Date();
      let n = d.getDate();
      let y = d.getFullYear();
      let m = d.getMonth() + 1;
      console.log('Year', y)
      console.log('Month', m)
      this.setState({
         todayDate: n,
         todayDayYear: y,
         todayMonth: m
      }, () => {
         console.log('Tareek', this.state.todayDate)
         console.log('Tareek', this.state.todayDayYear)
         console.log('Tareek', this.state.todayMonth)
      })
   }

   componentDidUpdate = async () => {

   }

   getData = async () => {
      const { id, taskName, taskCreatedAt, completedTasks, refresh } = this.state;
      let response = await Database.select('saved_task');
      // console.log('RESULTCREATE', response)
      this.setState({
         newList: response.rows._array,
         allData: Object.assign({}, { data: response.rows._array }),
         refresh: false,
      }, () => {
         console.log('New', this.state.allData)
         console.log('Old', this.state.newList)
      })
   }

   // componentD

   saveDataInDatabase = async (task) => {
      const { id, taskName, taskCreatedAt, completedTasks, taskCategory, taskDesc } = task;
      console.log('Database called', task);
      let response = await Database.select('saved_task');
      if (response.rows._array.length === 0) {
         await Database.insertOrReplace('saved_task', { id, taskName, taskCreatedAt, completedTasks, taskCategory, taskDesc });
      }
      else {
         await Database.insert('saved_task', { id, taskName, taskCreatedAt, completedTasks, taskCategory, taskDesc }, () => {
            console.log('Er', taskCreatedAt)
         })
      }
      console.log('RESULT2', response)
      this.setState({
         newList: response.rows._array
      }, () => {
         console.log('FinalList', this.state.newList)
      })
   }

   onTextChange = (text, desc) => {
      console.log('text', text)
      this.setState({
         taskName: text,
      })
   }

   _onTextChange = (desc) => {
      console.log('desc', desc)
      this.setState({
         taskDesc: desc
      })
   }

   // tasks delete update add code starts here 

   addItem() {
      const { taskName, listOfTasks, taskCreatedAt, completedTasks, _taskCreatedAt, taskCategory, switchValue, taskDesc } = this.state
      let newData = new Date();
      console.log('MYDate', newData)
      let dateTime = + newData.getDate() + "/"
         + (newData.getMonth() + 1) + "/"
         + newData.getFullYear() + " @"
         + newData.getHours() + ":"
         + newData.getMinutes() + ":"
         + newData.getSeconds();

      let nextMonthDateTime = + newData.getDate() + "/"
         + (newData.getMonth() + 2) + "/"
         + newData.getFullYear() + " @"
         + newData.getHours() + ":"
         + newData.getMinutes() + ":"
         + newData.getSeconds();

      console.log('NEXT', nextMonthDateTime);
      console.log('PREVIOUS', dateTime);

      // if (!taskName || taskName.taskName) {
      //    Alert.alert('Please enter the task name!');
      //    return;
      // }

      // if (!taskDesc) {
      //    Alert.alert('Please enter the task description ');
      //    return
      // }

      let task = { taskName, id: shortid.generate(), taskCreatedAt: newData, completedTasks, taskCategory, taskDesc }
      let nextMonthTask = { taskName, id: shortid.generate(), taskCreatedAt: nextMonthDateTime, completedTasks, taskCategory, taskDesc }

      this.setState({
         listOfTasks: [...listOfTasks, task]
      }, () => {
         console.log('YO YO', this.state.listOfTasks);
      })

      this.saveDataInDatabase(task)

      this.setState({
         taskName: undefined,
         taskDesc: undefined
      })

      // if (switchValue == true) {
      //    this.setState({
      //       listOfTasks: [...listOfTasks, nextMonthTask]
      //    }, () => {
      //       console.log('WO YO', this.state.listOfTasks);
      //    })

      //    setInterval(() => {
      //       this.saveDataInDatabase(nextMonthTask);

      //    }, 10000)

      //    this.setState({
      //       taskName: undefined,
      //    })

      //    this.createTaskAfterAMonth(nextMonthTask);
      // }



      // let task = { taskName, id: shortid.generate(), taskCreatedAt: dateTime, completedTasks, taskCategory }
      // this.setState({
      //    listOfTasks: [...listOfTasks, task]
      // }, () => {
      //    // this.saveDataInDatabase(task)
      // })
      // this.saveDataInDatabase(task)
      // this.setState({
      //    taskName: undefined,
      // })
   }

   createTaskAfterAMonth = async (nextMonthTask) => {
      setInterval(this.saveDataInDatabase(nextMonthTask), 4000)
   }

   deleteItem = async (item) => {
      const { taskName, listOfTasks, newList } = this.state
      var filteredItems = this.state.newList.filter(function (_item) {
         return _item.id !== item.id;
      });
      let id = item.id
      let response = await Database.deleteTask(id);
      console.log('DELETED', response)

      this.setState({
         newList: filteredItems
      })
   }

   completeItem = async (item) => {
      const { taskName, listOfTasks, completedTasks, newList } = this.state
      var filteredItems = this.state.newList.filter(function (_item) {
         return _item.id !== item.id;
      });

      let response = await Database.select('saved_task');
      let _response = response.rows._array
      console.log('RESPONSE', _response)

      let filterData = _.findIndex(_response, { id: item.id })
      await Database.updateTask(item.id, true)
      _response[filterData].completedTasks = true;
      // console.log('Randi', filterData);
      let newArray = [..._response]
      this.setState({
         newList: newArray,
      }, () => {
         // console.log('Task is completed', (this.state.newList));

      })
      // console.log('CompletedValue', completedTasks)
   }

   // tasks delete update add code ends here 

   // search box code starts here

   // componentDidMount() {
   //    this.props.navigation.setParams({
   //       // refresh: this.fetchData,
   //       makeSearchBarActive: this.makeSearchBarActive
   //    });
   // }

   makeSearchBarActive = () => {
      console.log('Buttonpressd')
      const { allData } = this.state;
      let newList = Object.assign({}, allData);
      this.setState({
         searchBarActive: !this.state.searchBarActive,
         newList: newList.data
      })
   }

   closeSearchbar = () => {
      const { allData } = this.state;
      let newList = Object.assign({}, allData);
      this.setState({
         searchBarActive: false,
         newList: newList.data
      })
   }

   renderSearchBar = () => {
      console.log('xxxx')
      return (
         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 6 }}>
               <Searchbar search={this.searchTask} />
            </View>
            <TouchableOpacity
               onPress={() => this.closeSearchbar()}
               style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
               <Image source={require(`../../assets/clock.png`)} style={{ marginLeft: 5, padding: 10, width: 25, height: 25, borderRadius: 27, alignSelf: 'center' }} />
            </TouchableOpacity>
         </View>
      )

   }

   searchTask = async () => {
      const { newList, searchedTask, allData } = this.state;
      searchedTask = searchedTask.toLowerCase().trim()
      if (searchedTask != '') {
         let allTaskFilter = allData.data.filter(item => {
            let _taskName = item.taskName.toLowerCase()
            return searchedTask.length === 0 || _taskName.indexOf(searchedTask) > -1
         });
         this.setState({
            newList: allTaskFilter
         })
      }
      if (!searchedTask && searchedTask === '') {
         this.setState({
            newList: Object.assign({}, allData)
         })
      }
   }

   // search box code ends here

   // task category code starts here 

   // autoTaskCreation = async () => {
   //    // console.log('PR',)
   //    const { switchValue, taskName, listOfTasks, taskCreatedAt, completedTasks, _taskCreatedAt, taskCategory } = this.state
   //    // console.log('Value', switchValue)

   //    // console.log('MEG', taskCreatedAt)
   //    let newData = new Date();
   //    let dateTime = + newData.getDate() + "/"
   //       + (newData.getMonth() + 2) + "/"
   //       + newData.getFullYear() + " @"
   //       + newData.getHours() + ":"
   //       + newData.getMinutes() + ":"
   //       + newData.getSeconds();
   //    let task = { taskName, id: shortid.generate(), taskCreatedAt: dateTime, completedTasks, taskCategory }

   //    if (switchValue == true) {
   //       return (
   //          this.setState({
   //             listOfTasks: [...listOfTasks, task]
   //          }, () => {
   //             // this.saveDataInDatabase(task)
   //          })
   //          // this.saveDataInDatabase(task)
   //          // this.setState({
   //          //    taskName: undefined,
   //          // })
   //       )
   //    }
   // }

   addTaskAndCloseModal = () => {
      const {taskName, taskDesc}= this.state
      this.addItem();
      if (!taskName || !taskDesc) {
         Alert.alert('Please enter task details!');
         return ;
      }
      else{
      this.setState({ taskModalVisible: false })
      }
   }

   renderTaskCategoryModal = () => {
      const { icon, iconFont, colorCode } = this.state
      return (
         <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.taskModalVisible}
            onRequestClose={() => this.setState({ taskModalVisible: false })}>
            <View style={{
               position: 'absolute',
               height: (Dimensions.get('window').height) / 1.66,
               backgroundColor: '#fff',
               bottom: 0,
               left: 0,
               right: 0,
               padding: 10,
               paddingBottom: 0,
               borderTopLeftRadius: 10,
               borderTopRightRadius: 10,
               borderBottomRightRadius: 10,
               borderBottomLeftRadius: 10,
            }}>
               <View style={{ position: 'absolute', left: 152, top: -26, borderRadius: 30, backgroundColor: `${colorCode}`, borderWidth: 3, borderColor: '#fff' }}>
                  <Icon style={{ padding: 13, color: '#ffff' }} type={iconFont} name={icon} />
               </View>
               <TouchableOpacity
                  onPress={() => this.setState({ taskModalVisible: false })}
                  activeOpacity={2}
                  style={{
                     position: 'absolute',
                     right: 10,
                     top: 10
                  }}>
                  <Icon type='MaterialIcons' name='cancel' style={{
                     color: '#ff8080',
                     fontSize: 25
                  }} />
               </TouchableOpacity>
               <Text style={{ marginTop: 60, color: '#838383', fontWeight: 'bold', marginBottom: 10 }}>task name</Text>
               <TextInput placeholder='Enter your task name' style={{ paddingLeft: 5, backgroundColor: '#e0e0e0', borderRadius: 25, padding: 7 }}
                  value={this.state.taskName}
                  onChangeText={(text) => this.onTextChange(text)}
               />
               <Text style={{ marginTop: 20, color: '#838383', fontWeight: 'bold', marginBottom: 10 }}>description</Text>
               <TextInput placeholder='Enter your task description' style={{ paddingLeft: 5, backgroundColor: '#e0e0e0', borderRadius: 25, padding: 7 }}
                  value={this.state.taskDesc}
                  onChangeText={(desc) => this._onTextChange(desc)}
               />
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 30 }}>
                  <Text style={{ color: '#838383', fontWeight: 'bold', marginBottom: 10 }}>
                     Remind me next month
   </Text>
                  <Switch
                     value={this.state.switchValue}
                     onValueChange={(switchValue) => this.setState({ switchValue })} />
               </View>
               <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.addTaskAndCloseModal(this.state.taskName, this.state.taskDesc)}
                  style={{
                  }}>
                  <LinearGradient
                     start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                     style={{
                        alignSelf: 'center', padding: 10,
                        borderRadius: 5, justifyContent: 'center', paddingLeft: 20, paddingRight: 20,
                        alignContent: 'center', alignItems: 'center', marginTop: 20
                     }}
                     colors={['#b99bff', '#ba99ff']}>
                     <Text
                        style={{ fontSize: 15, marginBottom: 5, color: '#fff' }}>
                        Let's Go
      </Text>
                  </LinearGradient>
               </TouchableOpacity>
            </View>
         </Modal>


      )
   }

   openTaskCategoryModal = (item, icon, iconFont, colorCode) => {
      // console.log('Height', item)
      // console.log('ICON', icon)
      // console.log('ICONFONT', iconFont)
      console.log('ICONFONT', colorCode)
      this.setState({
         icon: icon,
         iconFont, iconFont,
         colorCode: colorCode,
         taskCategory: item,
         taskModalVisible: true,
      }, () => {
         // console.log('Zufu', this.state.taskCategory)
      })
   }

   links = [
      { title: 'Office', icon: 'work', iconFont: 'MaterialIcons', category: 'Office', colorCode: '#38d5e8' },
      { title: 'Personal', icon: 'user', iconFont: 'AntDesign', category: 'Personal', colorCode: '#af97f7' },
      { title: 'Home', icon: 'home', iconFont: 'MaterialIcons', category: 'Home', colorCode: '#ffc006' },
      { title: 'Gym', icon: 'directions-run', iconFont: 'MaterialIcons', category: 'Gym', colorCode: '#fa719b' },
      { title: 'Food', icon: 'food', iconFont: 'MaterialCommunityIcons', category: 'Food', colorCode: '#a8ed6f' },
   ]

   renerLinks() {
      return (
         <View style={{
            marginTop: 20,
            //  paddingTop: 30
            backgroundColor: '#fff', borderRadius: 10, marginLeft: 7, marginRight: 7
         }}>
            <ScrollView
               horizontal={true}
               showsHorizontalScrollIndicator={false}
            >
               {
                  this.links.map(item => {
                     return (
                        <View style={{ borderRadius: 2, flexDirection: 'column' }}>
                           <TouchableOpacity
                              activeOpacity={1}
                              onPress={() => this.openTaskCategoryModal(item.category, item.icon, item.iconFont, item.colorCode)}
                              style={{
                                 margin: 10, marginLeft: 15, marginRight: 15, height: 50, width: 50, justifyContent: 'center', alignContent: 'center', alignSelf: 'center',
                                 padding: 10, paddingBottom: 7, marginBottom: 5, alignItems: 'center',
                                 borderRadius: 50,
                                 backgroundColor: `${item.colorCode}`
                              }} >
                              <Icon type={item.iconFont} name={item.icon} style={{ color: '#fff' }} />
                           </TouchableOpacity>
                           <Text style={{ justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginBottom: 4 }}>
                              {item.title}
                           </Text>
                        </View>
                     )
                  })
               }
            </ScrollView>
         </View >
      )

   }

   render() {
      const { listOfTasks, taskCreatedAt, newList, completedTasks, searchBarActive, taskCategory, todayDate, todayDayYear, todayMonth, taskDesc } = this.state
      // console.log("CurrentDate", taskCategory);
      let _newList = newList.filter(item => item.completedTasks != 'true')
      // const time = moment(taskCreatedAt || moment.now()).fromNow;
      // console.log('Laru', time)
      const m = moment();
      console.log(m.format('ddd MMM Mo YY'))
      // const image = { uri:''};
      return (
         <View style={{ flex: 1, backgroundColor: '#fff', marginBottom: 10 }}>
            <ImageBackground source={require(`../../assets/bg3.jpg`)} style={{ flex: 1 }}>
               <View style={{ flex: 1, }}>
                  <View style={{ padding: 10 }}>
                     <View style={{ flexDirection: 'row', }}>
                        <Text style={{ fontSize: 30, flex: 0.25, color: '#fff' }}>
                           {todayDate}th
                        </Text>
                        <Text style={{ fontSize: 18, flex: 0.3, color: '#fff', alignSelf: 'center', justifyContent: 'center' }}>
                           {todayMonth} {todayDayYear}
                        </Text>
                     </View>
                     <Text style={{ marginTop: 10, color: '#fff' }}>
                        Where there is life there is hope.
                  </Text>
                  </View>

                  {this.renerLinks()}
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
                              paddingTop: 30,
                              paddingBottom: 30, backgroundColor: '#fff', borderRadius: 10, marginLeft: 7, marginRight: 7
                           }}>
                              <Image source={require(`../../assets/clock.png`)} style={{ marginLeft: 5, padding: 10, width: 25, height: 25, borderRadius: 27, alignSelf: 'center' }} />
                              <View style={{ flex: 1, alignSelf: 'center', }}>
                                 <Text style={{ marginLeft: 12 }}>
                                    {item.taskName}
                                 </Text>
                              </View>
                              <View style={{ flex: 1, alignSelf: 'center', }}>
                                 <Text style={{ marginLeft: 12 }}>
                                    {item.taskCategory}
                                 </Text>
                              </View>
                              <Text>
                                 {/* <Time time={item.taskCreatedAt} /> */}
                              </Text>
                              <View style={{ flex: 1, alignSelf: 'center' }}>
                                 {
                                    item.taskCreatedAt ?
                                       <Text>{item.taskCreatedAt}</Text>
                                       :
                                       <Text>
                                          NA
                                 </Text>
                                 }
                              </View>
                              <TouchableOpacity onPress={() => this.completeItem(item)} style={{
                                 flex: 0.4,
                              }}>
                                 <Image source={require(`../../assets/tick.png`)} style={{ marginLeft: 5, padding: 10, width: 30, height: 30, borderRadius: 27, alignSelf: 'center' }} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => this.deleteItem(item)} style={{ flex: 0.4, }}>
                                 <Image source={require(`../../assets/d1.jpg`)} style={{ padding: 10, width: 30, height: 30, borderRadius: 27, alignSelf: 'center' }} />
                              </TouchableOpacity>
                           </View>
                        )
                     }}
                  >
                  </FlatList>
                  {searchBarActive && this.renderSearchBar()}
                  {this.renderTaskCategoryModal()}
               </View >
            </ImageBackground>

         </View >
      )
   }
}