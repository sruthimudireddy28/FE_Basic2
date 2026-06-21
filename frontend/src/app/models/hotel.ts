
export interface Amenity {
  amenityId?: number;
  name?: string;
  description?: string;
  icon?: string;
  category?: string;
}


export class Hotel {
    hotelId?: number;
    name?: string;
    location?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    managerId?: number;
    description?: string;
    imageUrl?: string;
    imageUrls?: string[];
    rating?: number;
    totalReviews?: number;
    contactNumber?: string;
    email?: string;
    isActive?: boolean;
    amenities?: Amenity[];
    createdAt?: Date;
}
