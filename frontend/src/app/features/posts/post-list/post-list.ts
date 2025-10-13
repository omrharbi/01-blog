import { Component, } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { PostService } from '../../../core/service/servicesAPIREST/create-posts/post-service';
import { ActivatedRoute, } from '@angular/router';
import { PostResponse } from '../../../core/models/postData/postResponse';
import { apiUrl } from '../../../core/constant/constante';
import { PreviewService } from '../../../core/service/serivecLogique/preview/preview.service';

@Component({
  selector: 'app-post-list',
  imports: [Materaile],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss'
})
export class PostList {
  constructor(private postSerivce: PostService, private preview: PreviewService, private route: ActivatedRoute) { }
  apiUrl = apiUrl
  post: PostResponse = {
    _id: 0,
    title: "",
    content: "",
    htmlContent: "",
    excerpt: "",
    createdAt:"",
    medias: [],
    tags: []
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
          this.post.htmlContent = this.preview.renderMarkdownWithMedia(htmlContent); htmlContent;

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
      /<img([^>]*) ([^>]*)>/gi,
      (match, after) => {
        if (index < media.length) {
          const image = media[index]
          index++;
          return `<img class ="imageMa image-prview" src="${apiUrl}${image.filePath}" alt="${'Post image'}"${after}>`
        }
        return match
      }
    )
    return processHtml;
  }
}
