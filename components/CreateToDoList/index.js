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
import ProgressCircle from 'react-native-progress-circle'

const shortid = require('shortid');

export default class CreateToDoList extends Component {

   constructor(props) {
      super(props);
      this.deleteItem = this.deleteItem.bind(this);
      // this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      // this.state = {
      //    basic: true,
      //    // listViewData: _newList,
      // };
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

   // render progress bar starts here 

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

   // render progress bar ends here

   onRefresh = () => {
      this.setState({ refresh: true }, () => {
         this.getData()
      })
   };

   componentDidMount = async () => {
      this.getData();
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
      // console.log('RESULTCREATE', response)
      this.setState({
         newList: response.rows._array,
         allData: Object.assign({}, { data: response.rows._array }),
         refresh: false,
      }, () => {
         // console.log('New', this.state.allData)
         // console.log('Old', this.state.newList)
      })
   }

   // componentD

   saveDataInDatabase = async (task) => {
      const { id, taskName, taskCreatedAt, completedTasks, taskCategory, taskDesc, icon, iconFont, colorCode } = task;
      console.log('Database called', task);
      let response = await Database.select('saved_task');
      if (response.rows._array.length === 0) {
         await Database.insertOrReplace('saved_task', { id, taskName, taskCreatedAt, completedTasks, taskCategory, taskDesc, icon, iconFont, colorCode });
      }
      else {
         await Database.insert('saved_task', { id, taskName, taskCreatedAt, completedTasks, taskCategory, taskDesc, icon, iconFont, colorCode }, () => {
            console.log('Er', taskCreatedAt)
         })
      }
      // console.log('RESULT2', response)
      this.setState({
         newList: response.rows._array,
      },
         () => {
            this.completeTaskProgressBar()
         })
   }

   onTextChange = (text, desc) => {
      // console.log('text', text)
      this.setState({
         taskName: text,
      })
   }

   _onTextChange = (desc) => {
      // console.log('desc', desc)
      this.setState({
         taskDesc: desc
      })
   }

   // tasks delete update add code starts here 

   addItem() {
      const { taskName, listOfTasks, taskCreatedAt, completedTasks, icon, iconFont, colorCode, _taskCreatedAt, taskCategory, switchValue, taskDesc } = this.state

      console.log('CLRCD', colorCode)
      let newData = new Date();

      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let day = days[newData.getDay()];
      // console.log('DDD', day)

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      let month = monthNames[newData.getMonth()]
      // console.log("The current month is ", month);

      let n = newData.getDate();


      // console.log('MYDate', newData)

      let dateTime = + newData.getDate() + ', '
         + month;

      let nextMonthDateTime = + newData.getDate() + "/"
         + (newData.getMonth() + 2) + "/"
         + newData.getFullYear() + " @"
         + newData.getHours() + ":"
         + newData.getMinutes() + ":"
         + newData.getSeconds();

      // console.log('NEXT', nextMonthDateTime);
      // console.log('PREVIOUS', dateTime);

      // if (!taskName || taskName.taskName) {
      //    Alert.alert('Please enter the task name!');
      //    return;
      // }

      // if (!taskDesc) {
      //    Alert.alert('Please enter the task description ');
      //    return
      // }

      if (!taskName && !taskDesc) {
         return (
            Alert.alert('Please enter task details!')
         )
      }

      let task = { taskName, id: shortid.generate(), taskCreatedAt: dateTime, completedTasks, taskCategory, taskDesc, icon, iconFont, colorCode }
      let nextMonthTask = { taskName, id: shortid.generate(), taskCreatedAt: nextMonthDateTime, completedTasks, taskCategory, taskDesc, icon, iconFont, colorCode }

      this.setState({
         listOfTasks: [...listOfTasks, task],

      }, () => {
         // console.log('YO YO', this.state.listOfTasks);
      })

      this.saveDataInDatabase(task)

      this.setState({
         taskName: undefined,
         taskDesc: undefined
      })

      { this.completeTaskProgressBar() }


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

   // createTaskAfterAMonth = async (nextMonthTask) => {
   //    setInterval(this.saveDataInDatabase(nextMonthTask), 4000)
   // }

   deleteItem = async (item) => {
      const { newList } = this.state
      var filteredItems = this.state.newList.filter(function (_item) {
         return _item.id !== item.id;
      });
      let id = item.id
      let response = await Database.deleteTask(id);
      console.log('DELETED', response)

      this.setState({
         newList: filteredItems,
         taskUpdateModalVisible: false
      }, () => {
         this.completeTaskProgressBar();
      })
   }

   completeItem = async (item) => {
      const { completedTasks, newList } = this.state
      var filteredItems = this.state.newList.filter(function (_item) {
         return _item.id !== item.id;
      });
      let response = await Database.select('saved_task');
      let _response = response.rows._array
      console.log('RESPONSE', _response)
      let filterData = _.findIndex(_response, { id: item.id })
      await Database.updateTask(item.id, true)
      _response[filterData].completedTasks = true;
      let newArray = [..._response]
      this.setState({
         newList: newArray,
         taskUpdateModalVisible: false
      }, () => {
         this.completeTaskProgressBar();
      })
   }

   // tasks delete update add code ends here 

   // search box code starts here

   // componentDidMount() {
   //    this.props.navigation.setParams({
   //       // refresh: this.fetchData,
   //       makeSearchBarActive: this.makeSearchBarActive
   //    });
   // }

   // search box code starts  here

   // makeSearchBarActive = () => {
   //    const { allData } = this.state;
   //    let newList = Object.assign({}, allData);
   //    this.setState({
   //       searchBarActive: !this.state.searchBarActive,
   //       newList: newList.data
   //    })
   // }

   // closeSearchbar = () => {
   //    const { allData } = this.state;
   //    let newList = Object.assign({}, allData);
   //    this.setState({
   //       searchBarActive: false,
   //       newList: newList.data
   //    })
   // }

   // renderSearchBar = () => {
   //    return (
   //       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
   //          <View style={{ flex: 6 }}>
   //             <Searchbar search={this.searchTask} />
   //          </View>
   //          <TouchableOpacity
   //             onPress={() => this.closeSearchbar()}
   //             style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
   //             <Image source={require(`../../assets/clock.png`)} style={{ marginLeft: 5, padding: 10, width: 25, height: 25, borderRadius: 27, alignSelf: 'center' }} />
   //          </TouchableOpacity>
   //       </View>
   //    )

   // }

   // searchTask = async () => {
   //    const { newList, searchedTask, allData } = this.state;
   //    searchedTask = searchedTask.toLowerCase().trim()
   //    if (searchedTask != '') {
   //       let allTaskFilter = allData.data.filter(item => {
   //          let _taskName = item.taskName.toLowerCase()
   //          return searchedTask.length === 0 || _taskName.indexOf(searchedTask) > -1
   //       });
   //       this.setState({
   //          newList: allTaskFilter
   //       })
   //    }
   //    if (!searchedTask && searchedTask === '') {
   //       this.setState({
   //          newList: Object.assign({}, allData)
   //       })
   //    }
   // }

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
      const { taskName, taskDesc } = this.state
     
      
         this.addItem();
         this.setState({ taskModalVisible: false })
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
               <TextInput maxLength={50}
                  placeholder='Enter your task name' style={{ paddingLeft: 5, backgroundColor: '#e0e0e0', borderRadius: 25, padding: 7 }}
                  value={this.state.taskName}
                  onChangeText={(text) => this.onTextChange(text)}
               />
               <Text style={{ marginTop: 20, color: '#838383', fontWeight: 'bold', marginBottom: 10 }}>description</Text>
               <TextInput maxLength={64}
                  placeholder='Enter your task description' style={{ paddingLeft: 5, backgroundColor: '#e0e0e0', borderRadius: 25, padding: 7 }}
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
                  onPress={() => this.addTaskAndCloseModal(this.state.taskName, this.state.taskDesc, this.state.icon, this.state.iconFont, this.state.colorCode)}
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
      // console.log('ICONFONT', colorCode)
      this.setState({
         icon: icon,
         iconFont: iconFont,
         colorCode: colorCode,
         taskCategory: item,
         taskModalVisible: true,
      }, () => {
         // console.log('Zufu', this.state.colorCode)
      })
   }

   links = [
      { title: 'Office', icon: 'work', iconFont: 'MaterialIcons', category: 'Office', colorCode: '#38d5e8' },
      { title: 'Personal', icon: 'user', iconFont: 'AntDesign', category: 'Personal', colorCode: '#af97f7' },
      { title: 'Home', icon: 'home', iconFont: 'MaterialIcons', category: 'Home', colorCode: '#ffc006' },
      { title: 'Gym', icon: 'directions-run', iconFont: 'MaterialIcons', category: 'Gym', colorCode: '#fa719b' },
      { title: 'Food', icon: 'food', iconFont: 'MaterialCommunityIcons', category: 'Food', colorCode: '#a8ed6f' },
   ]

   renderStateData(item) {
      // console.log('fuck', item)
      // this.setState({
      //    icon: item.icon,

      //    iconFont: item.iconFont,
      //    colorCode: item.colorCode,
      // })
   }


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
                     // this.renderStateData(item)
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

   renderTaskUpdateModal = (item) => {
      return (
         <Modal animationType="fade"
            transparent={true}
            visible={this.state.taskUpdateModalVisible}
            onRequestClose={() => this.setState({ taskUpdateModalVisible: false })}>
            <View style={{
               position: 'absolute',
               height: (Dimensions.get('window').height) / 3.5,
               backgroundColor: '#dcdcdc',
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
               <TouchableOpacity
                  onPress={() => this.setState({ taskUpdateModalVisible: false })}
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
               <View style={{ alignSelf: 'center' }}>
                  <TouchableOpacity
                     onPress={() => this.completeItem(item)}
                     style={{
                        marginTop: 35,
                        flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                     }}>
                     <Text style={{ padding: 20, paddingLeft: 120, paddingRight: 120, fontWeight: 'bold', color: 'red', fontSize: 15 }}>
                        Complete
                     </Text>
                     {/* <Icon style={{}} type='MaterialIcons' name='check' style={{ color: '#ca8bfe' }} /> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => this.deleteItem(item)}
                     style={{
                        marginTop: 10,
                        flexDirection: 'row', justifyContent: 'space-between', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                     }}>
                     <Text style={{ padding: 20, paddingLeft: 130, paddingRight: 130, fontWeight: 'bold', color: '#2E86C1', fontSize: 15 }}>
                        Delete
                     </Text>
                     {/* <Icon style={{ padding: 70 }} type='MaterialIcons' name='delete' style={{ color: '#ca8bfe' }} /> */}
                  </TouchableOpacity>
                  {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                     <Text>
                        Edit this Task
                     </Text>
                     <Icon style={{ padding: 70 }} type='MaterialIcons' name='edit' style={{ color: '#ca8bfe' }} />
                  </TouchableOpacity> */}

               </View>
            </View>
         </Modal>
      )
   }

   openTaskUpdateModal(item) {
      this.setState({
         taskUpdateModalVisible: true
      })
   }

   render() {
      const { listOfTasks, taskCreatedAt, newList, completedTasks, progressBarPercentage, searchBarActive, taskCategory, todayDate, todayDayYear, todayMonth, taskDesc, icon, iconFont, colorCode } = this.state
      console.log('%%', progressBarPercentage)
      let _newList = newList.filter(item => item.completedTasks != 'true')
      console.log('NNN', _newList);
      // if (-_newList.length === 0) {
      //    return (
      //       <View style={{ flex: 1, backgroundColor: '#fff' }}>
      //          <ImageBackground source={require(`../../assets/bg3.jpg`)} style={{ flex: 1 }}>
      //             <View style={{ flex: 1, }}>

      //                <View>
      //                   <Text>
      //                      Come On!
      //                      Click on these Categories on top and Create your own ToDo's
      //          </Text>
      //                </View>
      //             </View>
      //          </ImageBackground>
      //       </View>
      //    )
      // }
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


                  {this.renerLinks()}

                  {_newList.length === 0 &&
                     <View style={{height: 350,  alignSelf: 'center', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
                           Come On! <Icon style={{ color: '#f9db2c' }} name='smile-wink' type='FontAwesome5' />
                        </Text>
                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
                           Click one of the category on top
                           </Text>
                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
                           and create your own ToDo's
                        </Text>
                     </View>
                  }
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
                              {this.renderTaskUpdateModal(item)}
                              <TouchableOpacity
                                 onPress={() => this.openTaskUpdateModal(item)}
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
                              {/* </TouchableOpacity> */}
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