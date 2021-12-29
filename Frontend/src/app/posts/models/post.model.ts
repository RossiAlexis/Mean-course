export interface Post {
  id: string;
  title: string;
  description: string;
  image: string | null | File
}

export interface PaginatedList<T> {
  items: T[];
  totalItems: number;
}
