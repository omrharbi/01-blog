
export const apiUrl = "http://localhost:9090/";
export const environment = {
    auth: {
        login: apiUrl + "auth/login",
        register: apiUrl + "auth/register",
        refreshToken: apiUrl + "auth/refresh-token",
    },
    user: {
        getMe: apiUrl + "users/me",
        updateMe: apiUrl + "users/update-me",
        changePassword: apiUrl + "users/change-password",
    },
    savepost: {
        post: apiUrl + "api/posts/create",
    },
    getpost: {
        posts: apiUrl + "api/posts/getallPost",
        postByID: apiUrl + "api/posts/getPostById/"
    }
    ,
    uploads: {
        Uploadimages: apiUrl + "api/upload",
        // postByID: apiUrl + "api/posts/getPostById/"
    }
    ,
    refreshToken: {
        refresh: apiUrl + "api/auth/refreshtoken",
        // postByID: apiUrl + "api/posts/getPostById/"
    }
}

export const LocalstorageKey = {
    token: "USER_TOKEN",
    refreshTokenKey: 'refresh_token'

}
