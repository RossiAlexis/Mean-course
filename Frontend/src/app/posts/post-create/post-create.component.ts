import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../models/post.model';
import { PostService } from '../service/post.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = ''
  newPost = '';
  constructor(private postService: PostService) {}

  onAddPost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const post: Post = {
      id: '',
      title: form.value.title,
      description: form.value.description
    }
    this.postService.addPost(post);
    form.resetForm();
  }
}
