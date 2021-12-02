import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient) {

  }

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts(){
    this.httpClient.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(
      map((postData)=> {
        return postData.posts.map((post: any)=> {
          return {
            title: post.title,
            description: post.description,
            id: post._id
          } as Post
        })
      })
    )
    .subscribe((posts)=> {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener():Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    this.httpClient.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
      console.log(responseData.message);
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: string) {
    this.httpClient.delete(`http://localhost:3000/api/posts/${postId}`)
    .subscribe(()=> {
      const updatedPosts = this.posts.filter(post => {
        return post.id !== postId;
      });
      this.postsUpdated.next(updatedPosts)
    });
  }
}
