import { TestBed } from '@angular/core/testing';
import { CommentLogiqueService } from './comment-logique-service';

// import { CommentService } from './comment-logique-service';

describe('CommentService', () => {
  let service: CommentLogiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentLogiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
