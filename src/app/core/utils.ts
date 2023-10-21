import { LibId } from "./models/models";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const digits = "1234567890";

export function genId(): LibId {
  let id: LibId = '';
  for (let i=0; i<5; ++i)
    id += alphabet.charAt(Math.floor(Math.random()*alphabet.length));
  for (let i=0; i<3; ++i)
    id += digits.charAt(Math.floor(Math.random()*digits.length));
  return id;
}
