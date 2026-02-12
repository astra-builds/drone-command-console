import { useDashboard } from '@/context/DashboardContext';
import { DroneType } from '@/types/drone';
import { ChevronLeft, ChevronRight, Radio } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_DOT: Record<string, string> = {
  idle: 'bg-status-idle',
  delivering: 'bg-status-delivering',
  returning: 'bg-status-idle',
  warning: 'bg-status-warning',
  critical: 'bg-status-critical',
  charging: 'bg-status-charging',
};

const STATUS_LABEL: Record<string, string> = {
  idle: 'IDLE',
  delivering: 'DELIVERING',
  returning: 'RTB',
  warning: 'LOW BAT',
  critical: 'CRITICAL',
  charging: 'CHARGING',
};

function DroneRow({ drone }: { drone: DroneType }) {
  const { selectDrone, selectedDroneId } = useDashboard();
  const isSelected = selectedDroneId === drone.id;

  return (
    <button
      onClick={() => selectDrone(isSelected ? null : drone.id)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
        isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${STATUS_DOT[drone.status]} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="font-mono text-xs text-foreground">{drone.id}</div>
        <div className="font-mono text-[10px] text-muted-foreground">{STATUS_LABEL[drone.status]}</div>
      </div>
      <div className="w-16 flex-shrink-0">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              drone.battery > 30 ? 'bg-primary' : drone.battery > 15 ? 'bg-status-warning' : 'bg-status-critical'
            }`}
            style={{ width: `${drone.battery}%` }}
          />
        </div>
        <div className="font-mono text-[9px] text-muted-foreground mt-0.5 text-right">{Math.round(drone.battery)}%</div>
      </div>
    </button>
  );
}

export default function FleetMonitor() {
  const { drones } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);

  const active = drones.filter(d => d.status === 'delivering' || d.status === 'returning').length;
  const warnings = drones.filter(d => d.status === 'warning' || d.status === 'critical').length;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        className="glass-panel-solid h-full flex flex-col overflow-hidden"
        animate={{ width: collapsed ? 48 : 240 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/5">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-primary" />
              <span className="font-mono text-xs text-primary tracking-wider">FLEET</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {!collapsed && (
          <>
            {/* Stats bar */}
            <div className="flex gap-4 px-3 py-2 border-b border-white/5">
              <div className="font-mono text-[10px]">
                <span className="text-muted-foreground">ACTIVE </span>
                <span className="text-primary">{active}</span>
              </div>
              <div className="font-mono text-[10px]">
                <span className="text-muted-foreground">WARN </span>
                <span className="text-status-warning">{warnings}</span>
              </div>
              <div className="font-mono text-[10px]">
                <span className="text-muted-foreground">TOTAL </span>
                <span className="text-foreground">{drones.length}</span>
              </div>
            </div>

            {/* Drone list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {drones.map(d => (
                <DroneRow key={d.id} drone={d} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
