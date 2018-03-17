import React from 'react';

import {
    StackNavigator,
} from 'react-navigation';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer as messages } from './src/state/message';
import { reducer as config } from './src/state/config';

const rootReducer = combineReducers({messages, config});

const store = createStore(rootReducer);

store.subscribe(()=>alert(JSON.stringify(store.getState())));
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
