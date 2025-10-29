import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({ providedIn: 'root' })
export class SharedServicePopUp {
    private sharedServicePopUp = new Subject<string | null>();
    popService$ = this.sharedServicePopUp.asObservable();
    onPopUp(postId: string) {
        this.sharedServicePopUp.next(postId)
    }
    closeAllPopups() {
        this.sharedServicePopUp.next(null);
    }
}