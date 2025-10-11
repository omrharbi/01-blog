import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreStories } from './explore-stories';

describe('ExploreStories', () => {
  let component: ExploreStories;
  let fixture: ComponentFixture<ExploreStories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreStories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreStories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
