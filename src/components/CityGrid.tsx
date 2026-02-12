import { useDashboard } from '@/context/DashboardContext';
import { LANDMARKS } from '@/data/landmarks';
import { LandmarkType, DroneType } from '@/types/drone';
import { Hexagon, Warehouse, Cross, Home, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LANDMARK_ICON: Record<string, React.ElementType> = {
  hq: Hexagon,
  hub: Warehouse,
  medical: Cross,
  residential: Home,
  charging: Zap,
};

const LANDMARK_COLOR: Record<string, string> = {
  hq: 'text-primary',
  hub: 'text-blue-400',
  medical: 'text-status-critical',
  residential: 'text-status-warning',
  charging: 'text-status-charging',
};

function LandmarkNode({ landmark }: { landmark: LandmarkType }) {
  const Icon = LANDMARK_ICON[landmark.kind];
  const color = LANDMARK_COLOR[landmark.kind];

  return (
    <div
      className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
    >
      <div className={`${color} opacity-60`}>
        <Icon size={landmark.kind === 'hq' ? 28 : 18} />
      </div>
      <span className="font-mono text-[9px] text-muted-foreground whitespace-nowrap opacity-50">
        {landmark.label}
      </span>
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  idle: 'bg-status-idle',
  delivering: 'bg-status-delivering',
  returning: 'bg-status-idle',
  warning: 'bg-status-warning',
  critical: 'bg-status-critical',
  charging: 'bg-status-charging',
};

const STATUS_GLOW: Record<string, string> = {
  delivering: 'shadow-[0_0_8px_hsl(189_94%_43%/0.6)]',
  warning: 'shadow-[0_0_8px_hsl(38_92%_50%/0.6)]',
  critical: 'shadow-[0_0_8px_hsl(0_84%_60%/0.6)]',
};

function DroneMarker({ drone }: { drone: DroneType }) {
  const { selectDrone, selectedDroneId } = useDashboard();
  const isSelected = selectedDroneId === drone.id;
  const glow = STATUS_GLOW[drone.status] || '';

  return (
    <motion.button
      className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer`}
      style={{ left: `${drone.x}%`, top: `${drone.y}%` }}
      onClick={() => selectDrone(isSelected ? null : drone.id)}
      whileHover={{ scale: 1.4 }}
    >
      {/* Ping ring */}
      {drone.status === 'delivering' && (
        <span className="absolute inset-0 rounded-full bg-status-delivering/30 animate-ping" />
      )}
      {drone.status === 'critical' && (
        <span className="absolute inset-0 rounded-full bg-status-critical/30 animate-ping" />
      )}

      <div className={`w-3 h-3 rounded-full ${STATUS_COLOR[drone.status]} ${glow} ${isSelected ? 'ring-2 ring-primary' : ''} transition-shadow`} />

      {/* Label on hover */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap glass-panel px-1.5 py-0.5">
        {drone.id}
      </div>
    </motion.button>
  );
}

export default function CityGrid() {
  const { drones, stormMode } = useDashboard();

  return (
    <div className={`absolute inset-0 ${stormMode ? 'city-grid-storm' : 'city-grid'} transition-all duration-1000`}>
      {/* Storm rain overlay */}
      {stormMode && (
        <div className="absolute inset-0 rain-overlay pointer-events-none z-20 opacity-30" />
      )}

      {/* Landmarks */}
      {LANDMARKS.map(l => (
        <LandmarkNode key={l.id} landmark={l} />
      ))}

      {/* Drones */}
      {drones.map(d => (
        <DroneMarker key={d.id} drone={d} />
      ))}

      {/* Scanline effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="scanline w-full" />
      </div>
    </div>
  );
}
