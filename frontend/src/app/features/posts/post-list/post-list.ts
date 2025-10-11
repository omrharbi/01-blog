import { Component, OnInit } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { PostService } from '../../../core/service/servicesAPIREST/create-posts/post-service';
import { ActivatedRoute, Route } from '@angular/router';
import { PostResponse } from '../../../core/models/postData/postResponse';

@Component({
  selector: 'app-post-list',
  imports: [Materaile],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss'
})
export class PostList {
  constructor(private postSerivce: PostService, private route: ActivatedRoute) { }
  post: PostResponse = {
    _id: 0,
    title: "",
    content: "",
    htmlContent: "",
    excerpt: "",
    medias: [],
  };
  loading: boolean = true;
  error: string = '';
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params["id"];
      this.postSerivce.getpostByID(id).subscribe({
        next: (response) => {
          this.post = response.data;
          let htmlContent = this.replaceImage(this.post.htmlContent ?? "");
          this.post.htmlContent = htmlContent;
          console.log(htmlContent, "*********** post");
        },
        error: (error) => {
          console.log("error to get post", error);

        }
      })
    })
  }

  private replaceImage(html: string): string {

    let index = 0;
    const media = this.post.medias ?? [];
    const processHtml = html.replace(
      /<img([^>]*)(src\s*=\s*["']\s*["']|class\s*=\s*["'][^"']*imageMa[^"']*["'])([^>]*)>/gi,
      (match, before, target, after) => {
        if (index < media.length) {
          const image = media[index]
          index++;
          return `<img${before} src=${image.filePath} alt="${'Post image'}"${after}>`
        }
        return match
      }
    )
    return processHtml;
  }
}
