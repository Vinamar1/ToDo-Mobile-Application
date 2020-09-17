import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import Database from '../../services/Database';
import moment from 'moment';

export default class ToDoList extends Component {
   constructor(props) {
      super(props);
   }
   state = {
      newList: [],
      refresh: false,
   }

   onRefresh = () => {
      this.setState({ refresh: true }, () => {
         this.getData()
      })
   };

   componentDidMount = async => {
      // console.log('VinamarKhar')
      this.getData()
   }

   getData = async () => {
      let response = await Database.select('saved_task');
      console.log('RESULTTODO', response)
      this.setState({
         newList: response.rows._array
      }, () => {
         // console.log('newlist', this.state.newList)
      })
   }

   render() {
      const { completedTasksn, newList } = this.state
      console.log('UditKhar', newList)
      let _newList = newList.filter(item => item.completedTasks = 'true')
      console.log('Fullcompleted', _newList)
      return (
         <View style={{ flex: 1, backgroundColor: '#f3f3f3', marginBottom: 100 }}>
            <View style={{ backgroundColor: '#f3f3f3', }}>
               <View style={{
                  flexDirection: 'row', marginTop: 20,
                  height: 50, paddingLeft: 5, paddingRight: 5, justifyContent: 'center'
               }}>
                  <Text style={{ fontSize: 20, justifyContent: 'center', alignContent: 'center' }}>
                     Completed Tasks
                  </Text>
               </View>
               <FlatList
                  data={_newList}
                  onRefresh={() => this.onRefresh()}
                  refreshing={this.state.refresh}
                  keyExtractor={item => item.name}
                  horizontal={false}
                  initialNumToRender={10}

                  renderItem={({ item }) => {
                     return (
                        <View style={{
                           flexDirection: 'row',
                           // width: '100%',
                           flex: 1,
                           marginTop: 20,
                           paddingTop: 30,
                           paddingBottom: 30, backgroundColor: '#fff', borderRadius: 10, marginLeft: 5, marginRight: 5

                        }}>
                           <Image source={require(`../../assets/clock.png`)} style={{ marginLeft: 5, padding: 10, width: 25, height: 25, borderRadius: 27, alignSelf: 'center' }} />
                           <View style={{ flex: 1, alignSelf: 'center', }}>
                              <Text style={{ marginLeft: 12 }}>
                                 {item.taskName}
                              </Text>
                           </View>
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
            </View>
         </View >
      )
   }
}


