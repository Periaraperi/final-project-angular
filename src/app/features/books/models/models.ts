export interface IWork {
  key: string; // /works/WorkId
  title: string;
  description: string | {type: string; value: string};
  subjects: string[];
  covers: number[]; // id of cover pages
}

// if response fails, will return this
export const DEFAULT_WORK: IWork = {
  key:"-1",
  title:"",
  description:"",
  subjects:[],
  covers:[]
}

export interface IBookISBN {
  title: string;
  publishers: string[];
  authors: AuthorEndPoint[];
  works: {key:string}[]; // api end point for works, maybe to fetch all editions
  subjects: string[];
  covers: number[];
  pagination: string;
  number_of_pages: number;
}

export type AuthorEndPoint = {
    key: string; // api endpoint to get author info /authors/authorID
};
export interface IEditions {
  entries: {
    key: string; // of type /books/OL...M
    title: string;
    publishers: string[];
    publish_date: string;
    number_of_pages: number;
    pagination: string;
    covers: number[];
    authors: AuthorEndPoint[];
  }[]
}

export interface IAuthor {
  name: string;
  birth_date: string;
  death_date: string;
  bio: string | {value:string};
}
