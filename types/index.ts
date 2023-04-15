export type User = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  followers: string;
  following: string;
  saved: string;
  id: number;
  authImage: string;
  email: string;
};

export interface Post {
  id: number;
  text: string;
  imageUrl: string;
  createdAt: string;
  likes: string;
  username: string;
  postId: number;
  userImage: string;
}

export type Comment = {
  id: number;
  comment: string;
  imageUrl: string;
  createdAt: string;
  likes: string;
  username: string;
  postId: number;
  post: number;
  userImage: string;
};
