import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient,
    private router: Router) {

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
            id: post._id,
            image: post.image
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
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('description', post.description);
    postData.append('image', post.image as File, post.title);
    this.httpClient.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData).subscribe((responseData) => {
      console.log(responseData.message);
      const post: Post = {
        id: responseData.post.id,
        title: responseData.post.title,
        description: responseData.post.description,
        image: responseData.post.image
      }
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
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

  updatePost(post: Post) {

    let postData: Post | FormData;
    if (typeof(post.image) === 'object') {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('description', post.description);
      postData.append('image', post.image as File, post.title);
    } else {
      postData = {...post}
    }
      this.httpClient.put(`http://localhost:3000/api/posts/${post.id}`, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        const updatedPost:Post  = {
          ...post,
          // image: response.image
        }
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });

  }
  getPost(id:string) {
    return this.httpClient.get<{_id: string, title: string, description: string, image: string}>(`http://localhost:3000/api/posts/${id}`);
  }
}
