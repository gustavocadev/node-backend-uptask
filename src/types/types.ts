import { Request } from "express";
import { Types, Document } from "mongoose";

export type UserType = {
  name: string;
  password: string;
  email: string;
  isconfirm?: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectType = {
  name: string;
  description: string;
  customer: string;
  deliveryDate?: string;
  author: Types.ObjectId;
  contributors?: Types.ObjectId[];
  createdAt?: string;
  updatedAt?: string;
};

export type RequestWithUser<T = {}, S = {}> = {
  user?: UserType & { _id: Types.ObjectId };
} & Request<S, {}, T>;

export type TaskType = {
  name: string;
  description: string;
  state?: boolean;
  deliveryDate: string;
  priority: string;
  project: Types.ObjectId;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskTypeWithProject = TaskType & { _id: Types.ObjectId } & {
  project: ProjectType & { _id: Types.ObjectId };
};
