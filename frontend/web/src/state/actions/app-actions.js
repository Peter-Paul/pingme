// USER ACTIONS

export const setcredentials=(data)=>{
    return {
        type:"CREDENTIALS",
        data:data
    }
}

export const updateUser=(data)=>{
    return {
        type:"UPDATE_USER",
        data:data
    }
}

export const removeUser=(id)=>{
    return {
        type:"REMOVE_USER",
        id:id
    }
}

// LISTING ACTIONS

export const updateListing=(data)=>{
    return {
        type:"UPDATE_LISTING",
        data:data
    }
}

export const addListing=(data)=>{
    return {
        type:"ADD_LISTING",
        data:data
    }
}

export const removeListing=(id)=>{
    return {
        type:"REMOVE_LISTING",
        id:id
    }
}

export const clearListing=()=>{
    return {
        type:"CLEAR_LISTING",
    }
}

// NOTIFICATION ACTIONS

export const addNotification=(data)=>{
    return {
        type:"ADD_NOTIFICATION",
        data:data
    }
}

export const removeNotification=(id)=>{
    return {
        type:"REMOVE_NOTIFICATION",
        id:id
    }
}



