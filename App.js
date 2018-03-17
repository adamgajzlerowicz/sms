import {
    StackNavigator,
} from 'react-navigation';

import HomeScreen from './src/HomeScreen';
import OptionsScreen from './src/OptionsScreen';


const App = StackNavigator({
    Home: { screen: HomeScreen },
    Options: { screen: OptionsScreen },
});

export default App;


// import React, { Component } from 'react';
// import {
//     NativeModules,
//     StyleSheet,
//     Text,
//     View,
//     DeviceEventEmitter,
// } from 'react-native';
//
// const { SMS } = NativeModules;
//
//
// type Props = {};
// class App extends Component<Props> {
//     constructor(f) {
//        super(f);
//        this.state = {
//            content: 'dupa'
//        }
//
//     }
//     componentWillMount() {
//         const that = this;
//         DeviceEventEmitter.addListener('info', function(e: Event) {
//             that.setState({content: that.state.content + JSON.stringify(e)})
//         });
//         SMS.send('a', '737909076', 'lkjsdf')
//     }
//
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.welcome}>
//                     {this.state.content}
//                 </Text>
//             </View>
//         );
//     }
// }
//
//
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
//
// export {
//     App as default
// };

