import fetch from 'node-fetch';
import { GRAPH_HOPPER_API_KEY } from './env';

interface Coordinate {
  latitude: number;
  longitude: number;
}

export async function calculateTimeBetweenCoordinates(origins: Coordinate[], destiny: Coordinate) {
  const query = new URLSearchParams({
    key: GRAPH_HOPPER_API_KEY
  }).toString();

  const resp = await fetch(`https://graphhopper.com/api/1/matrix?${query}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from_points: origins.map((origin) => [origin.longitude, origin.latitude]),
      to_points: [[destiny.longitude, destiny.latitude]],
      out_arrays: ['times'],
      vehicle: 'car'
    })
  });

  const data = (await resp.json()) as {
    times: number[][];
  };

  const times = data.times.map((time) => time[0]);
  return times;
}
