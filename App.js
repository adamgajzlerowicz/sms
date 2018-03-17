import React from 'react';

import {
    StackNavigator,
} from 'react-navigation';
import { Provider } from 'react-redux';
import { combineReducers, createStore, compose } from 'redux';
import { reducer as messages } from './src/state/message';
import { reducer as config } from './src/state/config';
import persistState, { mergePersistedState } from 'redux-localstorage';
import {AsyncStorage} from 'react-native';
import adapter from 'redux-localstorage/lib/adapters/AsyncStorage';


const rootReducer = compose(mergePersistedState())(combineReducers({messages, config}));


const storage = adapter(AsyncStorage);
const enchancer = compose(persistState(storage, 'redux'));

const store = createStore(rootReducer, {}, enchancer);

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
