import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../models/post.model';
import { PostService } from '../service/post.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = ''
  post!: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string | null = '';
  constructor(private postService: PostService,
    private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId')!;
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, description: postData.description};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      const post: Post = {
        id: '',
        title: form.value.title,
        description: form.value.description
      }
      this.postService.addPost(post);
    } else {
      const post: Post = {
        id:this.postId!,
        title: form.value.title,
        description: form.value.description
      }
      this.postService.updatePost(post);
    }
    form.resetForm();
  }
}
