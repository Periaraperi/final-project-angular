import { LibId } from "src/app/core/models/models";

export interface IUser {
  id?: LibId;
  email: string;
  nickname: string;
  password: string;
  history: {key: string}[];
}
