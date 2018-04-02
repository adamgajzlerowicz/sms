const ADD_MESSAGE = 'ADD_MESSAGE';
const CLEAR_MESSAGES = 'CLEAR_MESSAGES';

const defaultState = {};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return {...state, [action.payload.id]: action.payload};
        case CLEAR_MESSAGES:
            return defaultState;
        default:
            return state;
    }

};

const addMessage = message => ({type: ADD_MESSAGE, payload: message});
const clearMessages = () => ({type: CLEAR_MESSAGES});

export {
    reducer, addMessage, clearMessages
};

