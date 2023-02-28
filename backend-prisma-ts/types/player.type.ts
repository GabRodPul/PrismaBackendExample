type Role = "USER" | "ADMIN";

type PlayerData = {
    pid?: string;
    username: string;
    password: string;
    isAdmin: boolean
};

export { Role, PlayerData }