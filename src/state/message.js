
const ADD_MESSAGE = 'ADD_MESSAGE';
const CLEAR_MESSAGES = 'CLEAR_MESSAGES';

const reducer = (state = [], action)=>{
    switch (action.type){
        case ADD_MESSAGE:
            return [...state, action.payload];
        case CLEAR_MESSAGES:
            return [];
        default:
            return state;
    }

};

const addMessage = message => ({ type: ADD_MESSAGE, payload: message });
const clearMessages = (_) => ({ type: CLEAR_MESSAGES });

export {
    reducer, addMessage, clearMessages
};

