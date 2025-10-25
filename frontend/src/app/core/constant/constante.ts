
export const apiUrl = "http://localhost:9090/";
export const token = localStorage.getItem('USER_TOKEN');
export const environment = {
    auth: {
        login: apiUrl + "auth/login",
        register: apiUrl + "auth/register",
        refreshToken: apiUrl + "auth/refreshtoken",
    },
    user: {
        getMe: apiUrl + "api/user/profile",
        updateMe: apiUrl + "users/update-me",
        getMyPosts: apiUrl + "api/user/usersProfile",
        changePassword: apiUrl + "users/change-password",
    },

    subscriptions: {
        following: apiUrl + "api/subscriptions/following",
        followers: apiUrl + "api/subscriptions/followers",
        explore: apiUrl + "api/subscriptions/explore",
        addFollow: apiUrl + "api/subscriptions/follow",
        unfollow: apiUrl + "api/subscriptions/unfollow",
    },
    comment: {
        addComment: apiUrl + "api/comment/create",
        getComments: apiUrl + "api/comment/getCommentsWithPost",
        editComment: apiUrl + "api/comment/editComment",
        deleteComment: apiUrl + "api/comment/delete",
    },

    savepost: {
        post: apiUrl + "api/posts/create",
        edit: apiUrl + "api/posts/post/edit/",
        removeMedia: apiUrl + "api/media/",
    },
    post: {
        posts: apiUrl + "api/posts/getallPost",
        postByID: apiUrl + "api/posts/getPostById/",
        deletePost: apiUrl + "api/posts/post/delete"
    },
    like: {
        toggleLikePost: apiUrl + "api/likes/toggleLikePost",
        toggleLikeComment: apiUrl + "api/likes/toggleLikeComment",
        likedPosts: apiUrl + "api/likes/liked-posts"
    }
    ,
    uploads: {
        Uploadimages: apiUrl + "api/upload",
        // postByID: apiUrl + "api/posts/getPostById/"
    }

}

export const LocalstorageKey = {
    token: "USER_TOKEN",
    refreshTokenKey: 'refresh_token'

}
