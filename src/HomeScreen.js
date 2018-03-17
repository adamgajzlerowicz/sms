// @flow

import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux'
import { addMessage } from './state/message';
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

const Row = ({ id, status, type })=> {
    return <Text style={{padding: 10}}> {type}: {moment(id).format('YYYY-MM-DD HH:mm:ss')} {':         '} {status} </Text>;
};


class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home',
    };

    // message: {
    // status: string,
    // id: string
    // }

    componentDidMount() {
        DeviceEventEmitter.addListener('info', function(result: Event) {
            this.props.addMessage(result);
        });
    }

    sendSMSFunction(type: 'ON' | 'OFF') {
        const { number, contentOn, contentOff } = this.props.config;
        
        if (!number) {
            return ToastAndroid.show('Brakuje numeru telefonu', ToastAndroid.SHORT);
        }

        const id = moment().valueOf();

        SMS.send(String(id), String(number), type === 'ON' ? contentOn : contentOff, type);
    }
    render() {
        const { navigate } = this.props.navigation;
        let { messages } = this.props;
        messages = messages.map( m =><Row type={m.type} key={m.id} id={m.id} status={m.status} />);

        return (
            <View style={styles.container}>        
                <TouchableOpacity
                    onPress={() => navigate('Options') }
                    style={styles.button}
                >
                    <Text> Ustawienia </Text>
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
    addMessage: (message) => dispatch(addMessage((message))),
});

const ConnectedHomeScreen = connect(mapState, mapDispatch)(HomeScreen);

export default ConnectedHomeScreen;
