const  apiUrl="http://localhost:9090/";
export const environment = {
    auth:{
        login:apiUrl+"auth/login",
        register:apiUrl+"auth/register",
        refreshToken:apiUrl+"auth/refresh-token",
    },
    user:{
        getMe:apiUrl+"users/me",
        updateMe:apiUrl+"users/update-me",
        changePassword:apiUrl+"users/change-password",
    },
    savepost:{
        post:apiUrl+"api/posts/create", 
    },
    getAllpost:{
        posts:apiUrl+"api/posts/getallPost", 
    }
}
export const LocalstorageKey={
    token:"USER_TOKEN",
}
