import { TestBed } from '@angular/core/testing';

import { SharedServicePost } from './shared-service-post';

describe('SharedServicePost', () => {
  let service: SharedServicePost;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedServicePost);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
