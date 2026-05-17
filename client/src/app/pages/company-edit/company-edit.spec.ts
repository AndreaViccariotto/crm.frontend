import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEdit } from './company-edit';

describe('CompanyEdit', () => {
  let component: CompanyEdit;
  let fixture: ComponentFixture<CompanyEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
