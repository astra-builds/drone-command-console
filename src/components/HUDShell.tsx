import { useDashboard } from '@/context/DashboardContext';
import CityGrid from './CityGrid';
import FleetMonitor from './FleetMonitor';
import DroneCockpit from './DroneCockpit';
import GodMode from './GodMode';
import { Activity, Wifi, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </span>
  );
}

export default function HUDShell() {
  const { drones, stormMode, empBlast } = useDashboard();
  const onlineCount = drones.length;

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden bg-background"
      animate={{ opacity: empBlast ? [1, 0.2, 1, 0.3, 1] : 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Layer 0: City Grid */}
      <CityGrid />

      {/* Layer 1: HUD Frame */}
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 z-30 glass-panel-solid rounded-none border-t-0 border-x-0">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Activity size={14} className="text-primary" />
            <span className="font-mono text-xs text-primary tracking-[0.2em] text-glow-cyan">SWARM-NET</span>
            <span className="font-mono text-[10px] text-muted-foreground">V2.0</span>
          </div>

          <div className="flex items-center gap-4">
            {stormMode && (
              <span className="font-mono text-[10px] text-status-warning animate-pulse tracking-wider">
                ⚠ STORM ACTIVE
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <Wifi size={11} className="text-primary" />
              <span className="font-mono text-[10px] text-muted-foreground">{onlineCount} ONLINE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="text-muted-foreground" />
              <LiveClock />
            </div>
            <GodMode />
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-0 top-10 bottom-0 z-30 hidden md:flex">
        <FleetMonitor />
      </div>

      {/* Right Panel (Cockpit) */}
      <div className="absolute right-0 top-10 bottom-0 z-30">
        <DroneCockpit />
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 inset-x-0 z-30 glass-panel-solid rounded-none border-b-0 border-x-0">
        <div className="flex items-center justify-between px-4 py-1.5">
          <span className="font-mono text-[9px] text-muted-foreground">
            GRID: {stormMode ? 'HAZARD' : 'NOMINAL'} | LAT: 37.7749 | LNG: -122.4194
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">
            FPS: 60 | TICK: 50ms | UPLINK: STABLE
          </span>
        </div>
      </div>
    </motion.div>
  );
}
