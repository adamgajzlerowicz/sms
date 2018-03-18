// @flow

import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux'
import { addMessage, clearMessages } from './state/message';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ToastAndroid,
    NativeModules,
    DeviceEventEmitter,
} from 'react-native';

const { SMS } = NativeModules;

const Row = ({ id, status, type, color })=> {
    return (
        <Text style={{padding: 10}}>
            {type}: {moment(Number(id)).format('YYYY-MM-DD HH:mm:ss')}{':         '}
            {status} <FontAwesome style={{color}}>{Icons.circle}</FontAwesome>
        </Text>
    );
};


type MessageType = {
    id: string,
    status: string,
    type: string
}


class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home',
    };

    componentDidMount() {
        const that = this;
        DeviceEventEmitter.addListener('info', function(result: Event) {
            that.props.addMessage(result);
        });
    }

    sendSMSFunction(type: 'ON' | 'OFF') {
        const { number, messageOn, messageOff } = this.props.config;
        if (!number) {
            return ToastAndroid.show('Brakuje numeru telefonu', ToastAndroid.SHORT);
        }

        const id = moment().valueOf();

        SMS.send(String(id), String(number), type === 'ON' ? messageOn : messageOff, type);
    }
    render() {
        const { navigate } = this.props.navigation;
        let { messages } = this.props;
        messages = messages.map( m =><Row key={m.id} {...m}/>);

       return (
            <View style={styles.container}>        
                <TouchableOpacity
                    onPress={() => navigate('Options') }
                    style={styles.button}
                >
                    <Text> Ustawienia </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.clearMessages() }
                    style={styles.buttonClear}
                >
                    <Text> Wyczysc </Text>
                </TouchableOpacity>
                <ScrollView
                    style={{width: '90%'}}
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={() => {
                        this.scrollView.scrollToEnd({animated: true}) 
                    }}
                >
                    { messages }
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={()=>this.sendSMSFunction('ON')}
                        style={{
                            backgroundColor: 'green',
                            alignItems: 'center',
                            alignSelf: 'stretch',
                            padding: 20,
                            paddingLeft: 50,
                            paddingRight: 50,
                            margin: 20
                        }}
                    >
                        <Text style={{color: "white"}}> ON </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={ ()=>this.sendSMSFunction('OFF') }
                        style={{
                            backgroundColor: 'red',
                            alignItems: 'center',
                            alignSelf: 'stretch',
                            padding: 20,
                            paddingLeft: 50,
                            paddingRight: 50,
                            margin: 20
                        }}
                    >
                        <Text style={{color: "white"}}> OFF </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },  
    buttonContainer: {
        flexDirection: 'row'
    },
    buttonClear: {
        backgroundColor: '#05A5D1',
        alignItems: 'center',
        marginTop: 1,
        alignSelf: 'stretch',
        padding: 20,
    },
    button: {
        backgroundColor: '#05A5D1',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding: 20,
    }
});

const mapState = (state) => ({
    messages: state.messages,
    config: state.config
});

const mapDispatch = (dispatch)=>({
    addMessage: message => dispatch(addMessage(message)),
    clearMessages: _ => dispatch(clearMessages()),
});

const ConnectedHomeScreen = connect(mapState, mapDispatch)(HomeScreen);

export default ConnectedHomeScreen;
