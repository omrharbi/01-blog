export interface UserProfile {
    id: string,
    about: string,
    username: string,
    firstname: string,
    lastname: string,
    avatar: string,
    skills?: [],
    followersCount: number,
    followingCount: number,
    followingMe: boolean,
    postsCount: number,
}