import {faker} from '@faker-js/faker';

export const thousandSeparator = price => {
  return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function generateCaptainData(userLocation, count = 5) {
  if (userLocation) {
    const captains = [];
    for (let i = 0; i < count; i++) {
      const latitude = parseFloat(
        faker.number
          .float({
            min: userLocation.latitude - 0.1,
            max: userLocation.latitude + 0.1,
          })
          .toFixed(6),
      );
      const longitude = parseFloat(
        faker.number
          .float({
            min: userLocation.longitude - 0.1,
            max: userLocation.longitude + 0.1,
          })
          .toFixed(6),
      );
      captains.push({
        id: i + 1,
        lat: latitude,
        long: longitude,
        name: faker.person.fullName(),
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
