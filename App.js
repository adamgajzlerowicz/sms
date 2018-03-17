import React from 'react';

import {
    StackNavigator,
} from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from './src/state/message';

const store = createStore(reducer);

import HomeScreen from './src/HomeScreen';
import OptionsScreen from './src/OptionsScreen';



const Navigator = StackNavigator({
    Home: { screen: HomeScreen },
    Options: { screen: OptionsScreen },
});

const App = ()=>{
    return <Provider store={store}><Navigator/></Provider>;
};

export default App;
