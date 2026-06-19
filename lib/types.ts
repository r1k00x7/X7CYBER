export type AttackType =
  | 'Web Attackers'
  | 'DDoS Attackers'
  | 'Intruders'
  | 'Scanners'
  | 'Anonymizers';

export interface AttackEvent {
  id: string;
  time: string;
  sourceCountry: string;
  sourceCode: string;
  sourceLat: number;
  sourceLng: number;
  targetCountry: string;
  targetCode: string;
  targetLat: number;
  targetLng: number;
  attackType: AttackType;
}

export type Interval = '1h' | '6h' | '24h';

export const ATTACK_TYPES: AttackType[] = [
  'Web Attackers',
  'DDoS Attackers',
  'Intruders',
  'Scanners',
  'Anonymizers',
];
