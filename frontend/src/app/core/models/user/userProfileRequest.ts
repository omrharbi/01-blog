export interface RequestEditProfile {
    firstname: string;
    lastname: string;
    avatar: string;
    skills: Skills[];
    email:string,
    about :string,
}
export interface Skills {
    skills: string
}