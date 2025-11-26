
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
        edit_profile: apiUrl + "api/user/edit-profile",
    },
    admin: {
        getUsers: apiUrl + "api/admin/all-users",
        getPosts: apiUrl + "api/admin/all-posts",
        getMyPosts: apiUrl + "api/user/usersProfile",
        changePassword: apiUrl + "users/change-password",
        banUser: apiUrl + "api/admin/ban-user/",
        changeRole: apiUrl + "api/admin/change-role/",
        deleteUser: apiUrl + "api/admin/delete/",
        deletePosts: apiUrl + "api/admin/delete-posts/",
        hidden_post: apiUrl + "api/admin/hiddeng-post/",
        admins: apiUrl + "api/admin/admins",
        activeUsers: apiUrl + "api/admin/active-users",
        bannedUser: apiUrl + "api/admin/banned-user",
        countUsers: apiUrl + "api/admin/count-users",
        allPosts: apiUrl + "api/admin/all-posts",
    },

    subscriptions: {
        following: apiUrl + "api/subscriptions/following",
        followers: apiUrl + "api/subscriptions/followers",
        explore: apiUrl + "api/subscriptions/explore",
        addFollow: apiUrl + "api/subscriptions/follow",
        unfollow: apiUrl + "api/subscriptions/unfollow",
        is_I_follow: apiUrl + "api/subscriptions/is_i_following",
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
        get_all_posts_from_followed_users: apiUrl + "api/posts/getAllPostsFromFollowedUsers",
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
    ,
    tags: {
        tags: apiUrl + "api/trand/trainding",
        // postByID: apiUrl + "api/posts/getPostById/"
    },
    report: {
        report_post: apiUrl + "api/report/create-report-post",
        report_user: apiUrl + "api/report/create-report-user",
        get_all_posts_report: apiUrl + "api/report/admin/get-posts-all-report",
        get_all_user_report: apiUrl + "api/report/admin/get-user-all-report",
        // postByID: apiUrl + "api/posts/getPostById/"
    }
    ,
    notification: {
        getNotification: apiUrl + "api/notifications/getAllNotifications",
        read: apiUrl + "api/notifications/read"
    }

}

export const LocalstorageKey = {
    token: "USER_TOKEN",
    refreshTokenKey: 'refresh_token'

}
