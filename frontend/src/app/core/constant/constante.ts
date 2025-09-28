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
    upload:{
        upload_image:apiUrl+"api/upload", 
    }
}
export const LocalstorageKey={
    token:"USER_TOKEN",
}
