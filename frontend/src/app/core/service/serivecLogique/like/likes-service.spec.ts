import { TestBed } from '@angular/core/testing';

import { likesServiceLogique } from './likes-service-logique';

describe('LikesService', () => {
  let service: likesServiceLogique;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(likesServiceLogique);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
