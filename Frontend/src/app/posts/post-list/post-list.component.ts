import { Component, OnInit, OnDestroy } from "@angular/core";
import { combineLatest, map, merge, mergeWith, Observable, Subject, Subscription, switchMap, tap } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";
import { PageEvent } from "@angular/material/paginator";
import { PaginatedList } from "../models/post.model";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  isLoading = false;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId!: string | null;

  private pageChange$: Subject<PageEvent> = new Subject<PageEvent>();
  private deletePost$: Subject<string> = new Subject<string>();
  private authStatusSub!: Subscription;
  public posts$!: Observable<PaginatedList<Post>>;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.setupPostsObservable();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  private setupPostsObservable(): void {
    this.posts$ = merge(
      this.postsService.getPosts(this.postsPerPage, this.currentPage),
      this.getPageChangeObservable(),
      this.getDeleteObservable()
      ).pipe(
        tap(() => {
          this.isLoading = false;
        })
      );
  }

  private getPageChangeObservable(): Observable<PaginatedList<Post>> {
    return this.pageChange$.pipe(
      tap(pageData => {
        this.currentPage = pageData.pageIndex + 1,
        this.postsPerPage =  pageData.pageSize
        this.isLoading = true;
      }),
      switchMap(() => this.postsService.getPosts(this.postsPerPage, this.currentPage))
    )
  }

  private getDeleteObservable(): Observable<PaginatedList<Post>> {
    return this.deletePost$.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap((postId)=> this.postsService.deletePost(postId))
    )
    .pipe(
      switchMap(x => this.postsService.getPosts(this.postsPerPage, this.currentPage) )
    ) ;
  }

  public onChangedPage(pageData: PageEvent): void {
    this.pageChange$.next(pageData);
  }

  public onDelete(postId: string): void {
    this.deletePost$.next(postId);
  }


}
