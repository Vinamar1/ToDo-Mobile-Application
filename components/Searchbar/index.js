import React, { useState, Component } from 'react';
import { View, Style, StyleSheet, Item, Image, TextInput } from 'react-native'
// import { Icon, Input, Item } from 'native-base';
import Database from '../../services/Database';
import * as _ from 'lodash';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';


// export default class Seachbar extends Component {

//     state = {
//         inputValue: undefined
//     }

//     onTextChange = (text) => {
//         props.search(text)
//         this.setState({
//             inputValue: text
//         })
//     }

//     render() {
//         return (
//             <View style={{
//                 margin: 10,
//                 backgroundColor: '#fff',
//             }} >
//                 <Item regular>
//                     {/* <Icon type='MaterialIcons' name='search' style={{ color: '#ccc' }} /> */}
//                     <Image source={require(`../../assets/clock.png`)} style={{ marginLeft: 5, padding: 10, width: 25, height: 25, borderRadius: 27, alignSelf: 'center' }} />
//                     <TextInput placeholder='Search...'
//                         // onChangeText={searchText} value={inputValue}

//                         value={this.state.inputValue}
//                         onChangeText={(text) => this.onTextChange(text)}

//                     />
//                     {/* {
//                         inputValue !== '' && props.removeText && <TouchableOpacity onPress={removeInputText}>
//                             <Image source={require(`../../assets/clock.png`)} style={{ marginLeft: 5, padding: 10, width: 25, height: 25, borderRadius: 27, alignSelf: 'center' }} />

//                         </TouchableOpacity>
//                     } */}
//                 </Item>
//             </View >
//         );
//     }


// }


let Searchbar = (props) => {
    const [inputValue, setInputValue] = useState('')


    searchText = text => {
        // props.search(text);
        setInputValue(text);
    }

    removeInputText = () => {
        setInputValue('');
        // props.search('');
    }

console.log('xxxx')
return (
    <View style={{
        margin: 10,
        backgroundColor: '#fff',
    }} >
        <Item regular>
            {/* <Icon type='MaterialIcons' name='search' style={{ color: '#ccc' }} /> */}
            <Image source={require(`../../assets/clock.png`)} style={{ marginLeft: 5, padding: 10, width: 25, height: 25, borderRadius: 27, alignSelf: 'center' }} />
            <TextInput placeholder='Search...'
                onChangeText={searchText} value={inputValue}
            />
            {
                inputValue !== '' && props.removeText && <TouchableOpacity onPress={removeInputText}>
                    {/* <Icon type='MaterialCommunityIcons' name='close' style={{ color: '#ccc' }} /> */}
                    {/* <Image */}
                    <Image source={require(`../../assets/clock.png`)} style={{ marginLeft: 5, padding: 10, width: 25, height: 25, borderRadius: 27, alignSelf: 'center' }} />

                </TouchableOpacity>
            }
        </Item>
    </View >
);
}
const styles = StyleSheet.create({
    searchboxContainer: {
        margin: 10,
        backgroundColor: '#fff',
        flexDirection: 'row'
    },
})

export default Searchbar;