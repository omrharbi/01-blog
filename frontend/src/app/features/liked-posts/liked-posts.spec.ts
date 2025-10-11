import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedPosts } from './liked-posts';

describe('LikedPosts', () => {
  let component: LikedPosts;
  let fixture: ComponentFixture<LikedPosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedPosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedPosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
