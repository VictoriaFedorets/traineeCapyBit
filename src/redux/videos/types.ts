// generar state
export interface VideoData {
  id: number;
  userId: number;
  name: string;
  url: string;
  poster?: string;
  type: "local" | "external";
  createAt: string;
  updateAt: string;

  likes?: number;
  liked?: boolean;
  comments?: VideoComment[];
}

export interface VideoComment {
  id: number;
  userId?: number;
  videoId?: number;
  text: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
  };
}

// slice
export interface VideosState {
  items: VideoData[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

// operations
export interface AddVideoPayload {
  name: string;
  url: string;
  poster?: string;
}

export interface UpdateVideoPayload {
  id: number;
  name: string;
  url: string;
  poster?: string;
}

// Лайки
export interface ToggleLikePayload {
  videoId: number;
}

export interface ToggleLikeResponse {
  videoId: number;
  liked: boolean;
  likes: number;
}

// Комментарии
export interface FetchCommentsPayload {
  videoId: number;
}

export interface FetchCommentsResponse {
  videoId: number;
  comments: VideoComment[];
}

export interface AddCommentPayload {
  videoId: number;
  text: string;
}

export type AddCommentResponse = VideoComment;
