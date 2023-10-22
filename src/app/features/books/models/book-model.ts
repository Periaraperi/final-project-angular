import { IAuthor } from "./author-model";

export interface IISBNBook { // isbn response gives me this data
  title: string;
  publishers: string[];
  number_of_pages: number;
  pagination?: number;
  authors: {key: string}[];
  isbn_10: string;
  isbn_13: string;
  works: {key: string}[];
}

export type FullInfo = IISBNBook & {description?: string} & {authorsDetails: IAuthor[]};
