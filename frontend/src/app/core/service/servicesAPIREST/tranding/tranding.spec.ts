import { TestBed } from '@angular/core/testing';

import { Tranding } from './tranding';

describe('Tranding', () => {
  let service: Tranding;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tranding);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
