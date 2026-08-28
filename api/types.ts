export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface PostFields {
  id: string;
  user: string | null;
  title: string;
  description: string | null;
  image: string | null;
}

export type PostWithoutId = Omit<PostFields, 'id'>;

export interface CommentFields {
  user: string;
  post: string;
  text: string;
}
