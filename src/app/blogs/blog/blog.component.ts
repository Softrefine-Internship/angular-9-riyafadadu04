import { Component, HostListener, OnInit } from '@angular/core';
import { BlogData, BlogDataService } from '../blog-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  blogs: BlogData[] = [];
  isLoading: boolean = false;
  hasMore: boolean = true;

  constructor(
    private blogDataService: BlogDataService,
    private router: Router
  ) {}

  ngOnInit() {
    const storedBlogs = this.blogDataService.getStoredBlogs();
    console.log(storedBlogs);
    if (storedBlogs.length > 0) {
      this.blogs = storedBlogs;
      this.hasMore = true;
    } else {
      this.loadBlogs();
    }
  }

  loadBlogs() {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    this.blogDataService.fetchBlogData().subscribe(
      (response) => {
        const newBlogs = response.blogs;
        if (newBlogs.length === 0) {
          this.hasMore = false;
        } else {
          this.blogs = [...this.blogs, ...newBlogs];
          this.blogDataService.storeBlogs(this.blogs);
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading blogs:', error);
        this.isLoading = false;
      }
    );
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      this.loadBlogs();
    }
  }

  onblogClick(blog: BlogData) {
    this.router.navigate(['/blog', blog.id]);
  }
}
