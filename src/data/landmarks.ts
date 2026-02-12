import { LandmarkType } from '@/types/drone';

export const LANDMARKS: LandmarkType[] = [
  { id: 'hq', label: 'Central HQ', kind: 'hq', x: 50, y: 50 },
  { id: 'hub-1', label: 'Distribution Hub Alpha', kind: 'hub', x: 78, y: 18 },
  { id: 'hub-2', label: 'Distribution Hub Beta', kind: 'hub', x: 22, y: 72 },
  { id: 'med-1', label: 'City Medical Center', kind: 'medical', x: 18, y: 22 },
  { id: 'med-2', label: 'East Clinic', kind: 'medical', x: 82, y: 65 },
  { id: 'res-1', label: 'Residential Zone A', kind: 'residential', x: 35, y: 82 },
  { id: 'res-2', label: 'Residential Zone B', kind: 'residential', x: 68, y: 78 },
  { id: 'charge-1', label: 'Charging Pad North', kind: 'charging', x: 42, y: 15 },
  { id: 'charge-2', label: 'Charging Pad South', kind: 'charging', x: 60, y: 88 },
];

const CARGO_OPTIONS = [
  { cargo: 'Medical Supplies', weight: 2.1 },
  { cargo: 'Food Package', weight: 3.4 },
  { cargo: 'Electronics', weight: 1.8 },
  { cargo: 'Emergency Kit', weight: 4.2 },
  { cargo: 'Documents', weight: 0.5 },
  { cargo: 'Pharmaceuticals', weight: 1.2 },
  { cargo: null, weight: 0 },
];

export function getRandomLandmark(excludeId?: string): LandmarkType {
  const filtered = LANDMARKS.filter(l => l.id !== excludeId);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomCargo() {
  return CARGO_OPTIONS[Math.floor(Math.random() * CARGO_OPTIONS.length)];
}

export function generateInitialDrones() {
  return Array.from({ length: 12 }, (_, i) => {
    const startLandmark = LANDMARKS[Math.floor(Math.random() * LANDMARKS.length)];
    const targetLandmark = getRandomLandmark(startLandmark.id);
    const c = getRandomCargo();
    return {
      id: `DR-${String(i + 1).padStart(2, '0')}`,
      label: `Drone ${i + 1}`,
      x: startLandmark.x + (Math.random() - 0.5) * 4,
      y: startLandmark.y + (Math.random() - 0.5) * 4,
      targetX: targetLandmark.x,
      targetY: targetLandmark.y,
      targetLandmarkId: targetLandmark.id,
      status: 'delivering' as const,
      battery: 50 + Math.floor(Math.random() * 50),
      speed: 20 + Math.floor(Math.random() * 40),
      altitude: 100 + Math.floor(Math.random() * 200),
      signal: 70 + Math.floor(Math.random() * 30),
      cargo: c.cargo,
      cargoWeight: c.weight,
      isPaused: false,
    };
  });
}
