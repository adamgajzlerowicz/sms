import React from 'react';
import { setConfig } from './state/config';
import { connect } from 'react-redux'
import {
    View, 
    ToastAndroid,
    TextInput,
    Button
} from 'react-native';

class OptionsScreen extends React.Component {
    static navigationOptions = {
        title: 'Opcje',
    };

    state = {
        number: this.props.config.number,
        messageOn: this.props.config.messageOn,
        messageOff: this.props.config.messageOff
    };

    setData() {
        this.props.setConfig(this.state);
        ToastAndroid.show('Zapisano', ToastAndroid.SHORT);
    };

    render() {
        return (
            <View>
                <TextInput placeholder={'Numer'} value={this.state.number} onChangeText={(number)=>this.setState({number})}/>
                <TextInput placeholder={'Wiadomosc ON'} value={this.state.messageOn} onChangeText={(messageOn)=>this.setState({messageOn})}/>
                <TextInput placeholder={'Wiadomosc OFF'} value={this.state.messageOff} onChangeText={(messageOff)=>this.setState({ messageOff })}/>
                <Button
                    title="Zapisz"
                    onPress={() => this.setData()}
                />
            </View>
        );
    }
}

const mapState = (state) => ({
    config: state.config
});

const mapDispatch = (dispatch)=> ({
    setConfig: (payload) => dispatch(setConfig(payload))
});

const ConnectedOptionsScreen = connect(mapState, mapDispatch)(OptionsScreen);

export default ConnectedOptionsScreen;
