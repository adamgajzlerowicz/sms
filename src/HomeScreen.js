import React, { Component } from 'react';
import moment from 'moment';
import {
    AsyncStorage,
    ScrollView,    
    AppRegistry,
    StyleSheet,
    Button,
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


export default class RNSMS extends Component {
    static navigationOptions = {
        title: 'Home',
    };

    // message: {
    // status: string,
    // id: string
    // }
    state = {
        messages: [],
        number: '',
        contentOn: '',
        contentOff: ''
    };

    componentDidMount() {
        const that = this;
        DeviceEventEmitter.addListener('info', function(result: Event) {
            AsyncStorage.getItem('messages').then( res => {
                let messages = !res ? [] : JSON.parse(res);

                messages.push(result);

                AsyncStorage.setItem('messages', JSON.stringify(messages)).then(()=>{
                    that.setState({ messages });
                })
            });
        });

        AsyncStorage.multiGet(['number','contentOn', 'contentOff', 'messages'])
            .then(([[a, number], [b, contentOn], [c, contentOff], [d, messages]]) => {
                this.setState({
                    number: number ? number : '',
                    contentOn: contentOn ? contentOn : '',
                    contentOff: contentOff ? contentOff : '',
                    messages: messages ? JSON.parse(messages) : [],
                })
            });
    }

    sendSMSFunction(type) { //ON | OFF
        const { number, contentOn, contentOff } = this.state;
        
        if (!number) {
            return ToastAndroid.show('Brakuje numeru telefonu', ToastAndroid.SHORT);
        }

        const id = moment().valueOf();

        SMS.send(String(id), String(number), type === 'ON' ? contentOn : contentOff, type);
    }
    render() {
        const { navigate } = this.props.navigation;
        let { messages } = this.state;
        messages = messages.map( m =><Row type={m.type} key={m.id} id={m.id} status={m.status} />) 

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
