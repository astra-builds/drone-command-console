export type DroneStatus = 'idle' | 'delivering' | 'returning' | 'warning' | 'critical' | 'charging';

export interface DroneType {
  id: string;
  label: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetLandmarkId: string;
  status: DroneStatus;
  battery: number;
  speed: number;
  altitude: number;
  signal: number;
  cargo: string | null;
  cargoWeight: number;
  isPaused: boolean;
}

export type LandmarkKind = 'hq' | 'hub' | 'medical' | 'residential' | 'charging';

export interface LandmarkType {
  id: string;
  label: string;
  kind: LandmarkKind;
  x: number; // percentage
  y: number; // percentage
}

export interface DashboardState {
  drones: DroneType[];
  selectedDroneId: string | null;
  stormMode: boolean;
  empBlast: boolean;
}
