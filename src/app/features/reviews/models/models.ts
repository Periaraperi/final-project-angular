export interface IReview {
  id: string; // /books/id
  texts: {
    value: string;
    userId: string;
  }[]// actual review texts and who wrote it
}

export const DEFAULT_REVIEW: IReview = {
  id: "",
  texts: []
}
