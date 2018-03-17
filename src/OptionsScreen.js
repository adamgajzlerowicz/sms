import React from 'react';
import { 
    View, 
    ToastAndroid,
    AsyncStorage,
    TextInput,
    Button
} from 'react-native';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Opcje',
    };
    state = {
        number: '',
        contentOn: '',
        contentOff: ''
    }

    componentDidMount() {
        AsyncStorage.multiGet(['number','contentOn', 'contentOff'])
            .then(([[a, number], [b, contentOn], [c, contentOff]]) => {
                this.setState({
                    number: number ? number : '',
                    contentOn: contentOn ? contentOn : '',
                    contentOff: contentOff ? contentOff : '',
                })
            });
    }

    setData() {
        AsyncStorage.multiSet([
            ['number', this.state.number],
            ['contentOn', this.state.contentOn], 
            ['contentOff', this.state.contentOff]
        ])
            .then(()=>ToastAndroid.show('Zapisano', ToastAndroid.SHORT));
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <TextInput placeholder={'Numer'} value={this.state.number} onChangeText={(number)=>this.setState({number})}/>
                <TextInput placeholder={'Wiadomosc ON'} value={this.state.contentOn} onChangeText={(contentOn)=>this.setState({contentOn})}/>
                <TextInput placeholder={'Wiadomosc OFF'} value={this.state.contentOff} onChangeText={(contentOff)=>this.setState({contentOff})}/>
                <Button
                    title="Zapisz"
                    onPress={() => this.setData()}
                />
            </View>
        );
    }
}
