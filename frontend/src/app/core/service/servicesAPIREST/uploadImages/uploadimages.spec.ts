import { TestBed } from '@angular/core/testing';

import { Uploadimages } from './uploadimages';

describe('Uploadimages', () => {
  let service: Uploadimages;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Uploadimages);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
