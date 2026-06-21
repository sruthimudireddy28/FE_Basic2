import { RoomAmenities } from "./room-amenities";

export class RoomResponse {
  roomId?: number;
  hotelId?: number;
  roomNumber?: string;
  roomType?: string;
  description?: string;
  pricePerNight?: number;
  maxOccupancy?: number;
  bedCount?: number;
  bedType?: string;
  floorNumber?: number;
  roomSize?: number;
  imageUrl?: string;
  imageUrls?: string[];
  isAvailable?: boolean;
  amenities?:RoomAmenities[];
  createdAt?: string;
}