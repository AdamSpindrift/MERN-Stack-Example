const passwordReducer = (state = false, action) => {
    switch(action.type){
        case "INVALID_PASSWORD":
            return state = true;

        default: 
            return state;
    }
};

export default passwordReducer;