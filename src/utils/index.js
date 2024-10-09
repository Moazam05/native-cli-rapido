import {faker} from '@faker-js/faker';

export const thousandSeparator = price => {
  return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const RADIUS_OF_EARTH_KM = 6371; // Earth's radius in kilometers

export function generateCaptainData(userLocation, count = 5) {
  if (userLocation) {
    const captains = [];

    for (let i = 0; i < count; i++) {
      // Generate a random distance within the 2 km radius
      const distance = Math.random() * 3; // Random distance from 0 to 2 km

      // Generate a random angle (direction) for the point
      const angle = Math.random() * 3 * Math.PI;

      // Convert the distance to latitude/longitude offsets
      const deltaLatitude = (distance / RADIUS_OF_EARTH_KM) * (180 / Math.PI);
      const deltaLongitude =
        (distance /
          (RADIUS_OF_EARTH_KM *
            Math.cos((userLocation.latitude * Math.PI) / 180))) *
        (180 / Math.PI);

      const latitude = parseFloat(
        (userLocation.latitude + deltaLatitude * Math.sin(angle)).toFixed(6),
      );
      const longitude = parseFloat(
        (userLocation.longitude + deltaLongitude * Math.cos(angle)).toFixed(6),
      );

      captains.push({
        id: i + 1,
        lat: latitude,
        long: longitude,
        name: faker.person.fullName(),
        phone: faker.phone.imei(),
        image: faker.image.avatar(),
      });
    }

    return captains;
  }
}

// Function to calculate distance between two coordinates
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Function to find closest captain
export const findClosestCaptain = (userLocation, captainData) => {
  if (userLocation && captainData) {
    let closestCaptain = null;
    let minDistance = Infinity;

    captainData.forEach(captain => {
      const distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        captain.lat,
        captain.long,
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestCaptain = captain;
      }
    });

    return closestCaptain;
  }
};
