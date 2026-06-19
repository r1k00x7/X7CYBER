import { COUNTRIES } from './countries.data';
import { ATTACK_TYPES } from './types';
import type { AttackEvent, AttackType } from './types';

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a single randomized simulated attack event.
export function makeEvent(): AttackEvent {
  const source = pick(COUNTRIES);
  let target = pick(COUNTRIES);
  let guard = 0;
  while (target.code === source.code && guard < 5) {
    target = pick(COUNTRIES);
    guard += 1;
  }

  // Generate random threat level (1-5) dengan distribusi lebih realistis
  // 50% Low, 25% Medium, 15% High, 7% Critical, 3% Catastrophic
  const rand = Math.random();
  let threatLevel: 1 | 2 | 3 | 4 | 5;
  if (rand < 0.5) threatLevel = 1;
  else if (rand < 0.75) threatLevel = 2;
  else if (rand < 0.9) threatLevel = 3;
  else if (rand < 0.97) threatLevel = 4;
  else threatLevel = 5;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: new Date().toISOString(),
    sourceCountry: source.name,
    sourceCode: source.code,
    sourceLat: source.lat,
    sourceLng: source.lng,
    targetCountry: target.name,
    targetCode: target.code,
    targetLat: target.lat,
    targetLng: target.lng,
    attackType: pick(ATTACK_TYPES) as AttackType,
    threatLevel: threatLevel,
  };
}
