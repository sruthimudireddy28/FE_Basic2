import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAmenity } from './delete-amenity';

describe('DeleteAmenity', () => {
  let component: DeleteAmenity;
  let fixture: ComponentFixture<DeleteAmenity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAmenity],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAmenity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
