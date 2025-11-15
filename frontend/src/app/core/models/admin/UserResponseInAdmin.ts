export interface UserResponseInAdmin {
    id: string,
    username: string,
    status: string,
    email: string,
    postsCount: number,
    hidden: boolean,
    role: string,
}


export interface PostsResponseInAdmin {
    id: string,
    firstname: string,
    lastname: string,
    status: string,
    email: string,
    commentCount: number,
    likesCount: boolean,
    reportCount: string,
    title: string,
    createdAt: string,
    role: string,
    hidden: boolean,
}


export interface ReportPosts {
    postId: string,
    reason: string,
    reportId: string,
    status: boolean,
    reportedContent: string,
    reportedUser: string,
    reporter: string,
    reportCount: string,
    createdAt: string,
    hidden: boolean,
    reportedUserId: string

}
export type ActionType = 'ban' | 'unban' | 'delete' | 'role' |'delete-post';