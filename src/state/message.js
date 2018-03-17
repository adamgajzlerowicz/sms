
const ADD_MESSAGE = 'ADD_MESSAGE';

const reducer = (state = [], action)=>{
    switch (action.type){
        case ADD_MESSAGE:
            return state.concat([action.payload]);
        default:
            return state;
    }

};

const addMessage = message =>({ type: ADD_MESSAGE, payload: message });


export {
    reducer, addMessage
};

