// @flow

import React, { Component } from 'react';
import {
    NativeModules,
    Platform,
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter,
    Keyboard,
} from 'react-native';

const { SMS } = NativeModules;

SMS.show('Awesome');


type Props = {};
class App extends Component<Props> {

    componentWillMount() {
        Keyboard.addListener('keyboardWillShow', function(e: Event) {
            alert(JSON.stringify(e));
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    dupa
                </Text>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export {
    App as default
};

