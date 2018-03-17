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
    constructor(f) {
       super(f);
       this.state = {
           content: 'dupa'
       }

    }
    componentWillMount() {
        const that = this;
        DeviceEventEmitter.addListener('info', function(e: Event) {
            that.setState({content: that.state.content + e.foo})
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    {this.state.content}
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

