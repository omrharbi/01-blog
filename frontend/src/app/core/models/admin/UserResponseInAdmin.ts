export interface UserResponseInAdmin {
    id: string,
    username: string,
    status: string,
    email: string,
    postsCount: number,
    hidden:boolean
}

export type ActionType = 'ban' | 'unban' | 'delete' |'role';