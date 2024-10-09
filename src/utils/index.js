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
