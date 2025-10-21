import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorePosts } from './explore-posts';

// import { ExplorePosts } from './Posts-Posts';

describe('ExplorePosts', () => {
  let component: ExplorePosts;
  let fixture: ComponentFixture<ExplorePosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorePosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorePosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
