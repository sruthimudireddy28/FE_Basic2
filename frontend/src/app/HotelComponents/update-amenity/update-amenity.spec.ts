import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAmenity } from './update-amenity';

describe('UpdateAmenity', () => {
  let component: UpdateAmenity;
  let fixture: ComponentFixture<UpdateAmenity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAmenity],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAmenity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
