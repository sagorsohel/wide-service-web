import { CityOption, UserLocation } from "../types";

export const POPULAR_LOCATIONS: CityOption[] = [
  {
    name: "Rajshahi",
    area: "Shaheb Bazar / Zero Point",
    lat: 24.3636,
    lng: 88.6241,
    popular: true,
  },
  {
    name: "Rajshahi",
    area: "Boalia / Ranibazar",
    lat: 24.367,
    lng: 88.602,
    popular: true,
  },
  {
    name: "Rajshahi",
    area: "Shah Makhdum / Shalbagan",
    lat: 24.393,
    lng: 88.605,
    popular: true,
  },
  {
    name: "Dhaka",
    area: "Dhanmondi",
    lat: 23.7461,
    lng: 90.3742,
    popular: true,
  },
  {
    name: "Dhaka",
    area: "Gulshan 1 & 2",
    lat: 23.7925,
    lng: 90.4078,
    popular: true,
  },
  {
    name: "Dhaka",
    area: "Mirpur 10",
    lat: 23.8071,
    lng: 90.3686,
    popular: true,
  },
  {
    name: "Dhaka",
    area: "Uttara Sector 3",
    lat: 23.8759,
    lng: 90.3795,
    popular: true,
  },
  {
    name: "Chittagong",
    area: "Agrabad Commercial Area",
    lat: 22.3275,
    lng: 91.8123,
    popular: false,
  },
  {
    name: "Sylhet",
    area: "Zindabazar",
    lat: 24.8949,
    lng: 91.8687,
    popular: false,
  },
  {
    name: "Khulna",
    area: "Shibbari Mor",
    lat: 22.8222,
    lng: 89.5544,
    popular: false,
  },
];

export const DEFAULT_USER_LOCATION: UserLocation = {
  address: "Zero Point, Shaheb Bazar, Boalia, Rajshahi",
  area: "Shaheb Bazar",
  city: "Rajshahi",
  latitude: 24.3636,
  longitude: 88.6241,
  isCurrentGps: false,
};
