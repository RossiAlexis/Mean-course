import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../models/post.model';
import { PostService } from '../service/post.service';
import { mimeType } from "./mime-type.validator";
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
  form!: FormGroup;
  imagePreview!: string;
  private mode = 'create';
  private postId: string | null = '';

  constructor(private postService: PostService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId')!;
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, description: postData.description, image:postData.image};
          this.form.setValue({
            title: this.post.title,
            description: this.post.description,
            image: this.post.image
          })
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost() {
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      const post: Post = {
        id: '',
        title: this.form.value.title,
        description: this.form.value.description,
        image: this.form.value.image as File
      }
      this.postService.addPost(post);
    } else {
      const post: Post = {
        id:this.postId!,
        title: this.form.value.title,
        description: this.form.value.description,
        image: this.form.value.image
      }
      this.postService.updatePost(post);
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event?.target as HTMLInputElement).files?.item(0)!;

    this.form.patchValue({
      image: file
    });
    this.form.get('image')?.updateValueAndValidity();
    console.log(file);
    console.log(this.form.value.image);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
