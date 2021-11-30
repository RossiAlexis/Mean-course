import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient) {

  }

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    this.httpClient.get<{message: string, posts:Post[]}>('http://localhost:3000/api/posts').subscribe((postsData)=> {
        this.posts = postsData.posts;
        this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener():Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }
  addPost(post: Post) {
    this.httpClient.post<{message: string}>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
      console.log(responseData.message);
    });
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
