import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (value == null) return '';
    const date = new Date(value);
    const nowDate = new Date();

    const diff = (nowDate.getTime() - date.getTime()) / 1000;
    if (diff < 60) {
      return 'Just Now';
    } else if (diff < 3600) {
      const mint = Math.floor(diff / 60);
      return `${mint} minute  ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hours  ago`;
    } else if (diff < 2592000) {
      const days = Math.floor(diff / 86400);
      return `${days} day ago`;
    } else if (diff < 31536000) {
      const months = Math.floor(diff / 2592000);
      return `${months} month ago`;
    } else {
      const years = Math.floor(diff / 31536000);
      return `${years} year ago`;
    }
  }
}
