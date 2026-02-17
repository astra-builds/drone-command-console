import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { DashboardState, DroneType } from '@/types/drone';
import { generateInitialDrones, getRandomLandmark, getRandomCargo, LANDMARKS } from '@/data/landmarks';

const MAX_TRAIL_LENGTH = 40;

interface DashboardContextType extends DashboardState {
  selectDrone: (id: string | null) => void;
  toggleStorm: () => void;
  triggerEMP: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be inside DashboardProvider');
  return ctx;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [drones, setDrones] = useState<DroneType[]>(() => generateInitialDrones());
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
  const [stormMode, setStormMode] = useState(false);
  const [empBlast, setEmpBlast] = useState(false);
  const trailsRef = useRef<Record<string, { x: number; y: number }[]>>({});
  const [droneTrails, setDroneTrails] = useState<Record<string, { x: number; y: number }[]>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Simulation tick
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDrones(prev => {
        const newDrones = prev.map(drone => {
          if (drone.isPaused) {
            return { ...drone, isPaused: false };
          }

          const speed = stormMode ? 0.15 : 0.4;
          const dx = drone.targetX - drone.x;
          const dy = drone.targetY - drone.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 1.5) {
            const newTarget = getRandomLandmark(drone.targetLandmarkId);
            const c = getRandomCargo();
            const newBattery = Math.max(drone.battery - 3, 5);
            let status: DroneType['status'] = 'delivering';
            if (newBattery < 15) status = 'critical';
            else if (newBattery < 30) status = 'warning';
            else if (newTarget.kind === 'charging') status = 'charging';
            else if (newTarget.kind === 'hq') status = 'returning';

            return {
              ...drone,
              x: drone.targetX,
              y: drone.targetY,
              targetX: newTarget.x,
              targetY: newTarget.y,
              targetLandmarkId: newTarget.id,
              battery: newTarget.kind === 'charging' ? Math.min(100, newBattery + 30) : newBattery,
              status,
              cargo: c.cargo,
              cargoWeight: c.weight,
              speed: 20 + Math.floor(Math.random() * 40),
              isPaused: true,
            };
          }

          const nx = dx / dist;
          const ny = dy / dist;
          return {
            ...drone,
            x: drone.x + nx * speed,
            y: drone.y + ny * speed,
            battery: Math.max(drone.battery - 0.02, 5),
          };
        });

        // Update trails
        const trails = trailsRef.current;
        for (const d of newDrones) {
          const trail = trails[d.id] || [];
          trail.push({ x: d.x, y: d.y });
          if (trail.length > MAX_TRAIL_LENGTH) trail.shift();
          trails[d.id] = trail;
        }
        trailsRef.current = trails;
        setDroneTrails({ ...trails });

        return newDrones;
      });
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [stormMode]);

  const selectDrone = useCallback((id: string | null) => setSelectedDroneId(id), []);
  const toggleStorm = useCallback(() => setStormMode(s => !s), []);
  const triggerEMP = useCallback(() => {
    setEmpBlast(true);
    // Reset all drone targets
    setDrones(prev => prev.map(d => {
      const newTarget = getRandomLandmark(d.targetLandmarkId);
      return { ...d, targetX: newTarget.x, targetY: newTarget.y, targetLandmarkId: newTarget.id };
    }));
    setTimeout(() => setEmpBlast(false), 600);
  }, []);

  return (
    <DashboardContext.Provider value={{
      drones,
      droneTrails,
      selectedDroneId,
      stormMode,
      empBlast,
      selectDrone,
      toggleStorm,
      triggerEMP,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}
