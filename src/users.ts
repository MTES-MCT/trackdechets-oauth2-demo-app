import { OAuth2User } from "./types";

const users: { [id: string]: OAuth2User } = {};

export function findUserByEmail(email: string) {
  if (users[email]) {
    return users[email];
  } else {
    throw new Error("User not found");
  }
}

export function saveUser(user: OAuth2User) {
  users[user.email] = user;
}
