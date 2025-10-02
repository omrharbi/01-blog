import { TestBed } from '@angular/core/testing';

import { UploadImage } from './upload-image';

describe('UploadImage', () => {
  let service: UploadImage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadImage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
