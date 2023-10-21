import { LibId } from "src/app/core/models/models";

export interface IUser {
  email: string,
  nickname: string,
  password: string,
  id?: LibId
}
