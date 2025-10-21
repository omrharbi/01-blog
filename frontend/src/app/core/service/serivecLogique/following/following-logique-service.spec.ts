import { TestBed } from '@angular/core/testing';

import { FollowingLogiqueService } from './following-logique-service';

describe('FollowingService', () => {
  let service: FollowingLogiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowingLogiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
