import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsManagement } from './reports-management';

describe('ReportsManagement', () => {
  let component: ReportsManagement;
  let fixture: ComponentFixture<ReportsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
