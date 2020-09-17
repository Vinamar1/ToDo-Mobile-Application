
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import moment from 'moment';

export default class Time extends Component {
    constructor(props) {
        super(props);
        this.date = props.time
    }
    render() {
        // const time = moment(this.date || moment.now()).fromNow
        const m = moment();
        console.log(m.format('ddd MMM Mo YY'))
        return (
            <View>
                <View style={{ flex: 1, alignSelf: 'center' }}>
                    {
                        time ?
                            <Text>{time}</Text>
                            :
                            <Text>
                                NA
                                 </Text>
                    }
                </View>            </View>
        )
    }
}
