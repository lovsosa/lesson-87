import { Types } from 'mongoose';

export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface PostFields {
  user: Types.ObjectId;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentFields {
  user: Types.ObjectId;
  post: Types.ObjectId;
  text: string;
}
