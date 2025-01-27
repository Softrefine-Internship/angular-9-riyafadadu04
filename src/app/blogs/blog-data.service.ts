import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

export interface BlogData {
  user_id: number;
  id: number;
  category: string;
  content_html: string;
  content_text: string;
  created_at: string;
  description: string;
  photo_url: string;
  title: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogDataService {
  blogData: BlogData[] = [];
  offset = 0;
  limit = 10;

  constructor(private http: HttpClient) {}

  fetchBlogData() {
    const BlogUrl = `https://api.slingacademy.com/v1/sample-data/blog-posts?offset=${this.offset}&limit=${this.limit}`;
    return this.http.get<any>(BlogUrl).pipe(
      tap(() => {
        this.offset += this.limit;
      })
    );
  }

  getStoredBlogs(): BlogData[] {
    return this.blogData;
  }

  storeBlogs(blogs: any[]) {
    this.blogData = blogs;
    return this.blogData;
  }

  resetBlogs() {
    this.blogData = [];
    this.offset = 0;
  }

  async loadMoreBlogData() {
    const response = await this.fetchBlogData().toPromise();
    this.blogData = [...this.blogData, ...response.data];
  }

  async fetchSingleBlogPost(blogId: number): Promise<any> {
    const BlogUrl = `https://api.slingacademy.com/v1/sample-data/blog-posts/${blogId}`;
    return this.http.get<any>(BlogUrl).toPromise();
  }
}
