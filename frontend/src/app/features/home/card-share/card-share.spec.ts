import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardShare } from './card-share';

describe('CardShare', () => {
  let component: CardShare;
  let fixture: ComponentFixture<CardShare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardShare]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardShare);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
