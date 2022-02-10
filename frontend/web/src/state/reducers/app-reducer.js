
const initialState = {
    credentials:{},
    user:{},
    list:[],
} 

export default (state = initialState, action) => {
    switch(action.type){
        // USER FUNCTIONS
        case "CREDENTIALS": return {...state, credentials:action.data}
        
        case "UPDATE_USER": return {...state, user:action.data}
        
        case "REMOVE_USER": return {...state, user:{}}
        
        // LISTING FUNCTIONS
        case "UPDATE_LISTING": return {...state, list:action.data}

        case "ADD_LISTING": return {...state, list:[...state.list,action.data]}

        case "REMOVE_LISTING": 
            return {
                ...state, 
                list:state.list.filter((item)=>item.id!==action.id), 
            }

        case "CLEAR_LISTING": return {...state, list:[]}

        // NOTIFICTATION FUNCTIONS
        case "ADD_NOTIFICATION": 
            return {
                ...state, 
                list:state.list.map((item)=>{
                    if (item.id===action.data.listing) return item.notifications=[...item.notifications,action.data] 
                    else return item
                })
            }

        case "REMOVE_NOTIFICATION": 
            return {
                ...state, 
                list:state.list.filter((item)=>item.id!==action.id), 
            }



        default: return state
    }
}