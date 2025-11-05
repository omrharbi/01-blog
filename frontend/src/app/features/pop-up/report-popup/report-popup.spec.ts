import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanPopup } from './report-popup';

describe('BanPopup', () => {
  let component: BanPopup;
  let fixture: ComponentFixture<BanPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
