import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAmenity } from './create-amenity';

describe('CreateAmenity', () => {
  let component: CreateAmenity;
  let fixture: ComponentFixture<CreateAmenity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAmenity],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAmenity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
