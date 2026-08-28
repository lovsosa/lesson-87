export interface PostUser {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  user?: PostUser | null;
  title: string;
  description?: string;
  image?: string | null;
  commentsCount?: number;
  createdAt?: string;
}

export interface PostMutation {
  title: string;
  description?: string;
  image?: File | null;
}

export interface Comment {
  _id: string;
  user: PostUser | null;
  post: string;
  text: string;
  createdAt: string;
}

export interface CommentMutation {
  post: string;
  text: string;
}

export interface Category {
  _id: string;
  title: string;
  description: string;
}

export interface RegisterMutation {
  username: string;
  password: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  token: string;
}

export interface ValidationError {
  errors: {
    [key: string] : {
      name: string;
      message: string;
    }
  }
}

export interface GlobalError {
  error: string;
}