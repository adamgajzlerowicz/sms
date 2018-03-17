
const SET_CONFIG = 'SET_CONFIG';

const reducer = (state = { number: '', messageOn: '', messageOff: '' }, action)=>{
    switch (action.type){
        case SET_CONFIG:
            return action.payload;
        default:
            return state;
    }

};

const setConfig = payload => ({ type: SET_CONFIG, payload });

export {
    reducer, setConfig
};

