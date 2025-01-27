import { Component, OnInit } from '@angular/core';
import { BlogData, BlogDataService } from '../blog-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent implements OnInit {
  blogId: number | null = null;
  blogContent!: BlogData;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private blogDataService: BlogDataService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.route.params.subscribe((params) => {
      this.blogId = +params['id'];
      if (this.blogId) {
        this.blogDataService.fetchSingleBlogPost(this.blogId).then(
          (blogData: any) => {
            if (blogData && blogData.blog) {
              this.blogContent = blogData.blog;
            }
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching blog post:', error);
            this.isLoading = false;
          }
        );
      } else {
        console.error('Invalid blogId:', this.blogId);
        this.isLoading = false;
      }
    });
  }

  navigateToBack() {
    window.history.back();
  }
}
