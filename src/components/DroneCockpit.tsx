import { useDashboard } from '@/context/DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crosshair, Gauge, Signal, Package, Plane, AlertTriangle } from 'lucide-react';

export default function DroneCockpit() {
  const { drones, selectedDroneId, selectDrone } = useDashboard();
  const drone = drones.find(d => d.id === selectedDroneId);

  return (
    <AnimatePresence>
      {drone && (
        <motion.div
          key="cockpit"
          className="glass-panel-solid w-80 h-full flex flex-col overflow-hidden"
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div>
              <h2 className="font-mono text-lg text-primary text-glow-cyan">{drone.id}</h2>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Cockpit View
              </span>
            </div>
            <button onClick={() => selectDrone(null)} className="text-muted-foreground hover:text-foreground p-1">
              <X size={16} />
            </button>
          </div>

          {/* Drone wireframe */}
          <div className="px-4 py-3 flex justify-center">
            <svg width="80" height="80" viewBox="0 0 120 120" className="text-primary/50">
              <g stroke="currentColor" strokeWidth="1" fill="none">
                <rect x="45" y="45" width="30" height="30" rx="4" />
                <line x1="45" y1="50" x2="15" y2="20" />
                <line x1="75" y1="50" x2="105" y2="20" />
                <line x1="45" y1="70" x2="15" y2="100" />
                <line x1="75" y1="70" x2="105" y2="100" />
                <circle cx="15" cy="20" r="10" strokeDasharray="3 2" />
                <circle cx="105" cy="20" r="10" strokeDasharray="3 2" />
                <circle cx="15" cy="100" r="10" strokeDasharray="3 2" />
                <circle cx="105" cy="100" r="10" strokeDasharray="3 2" />
              </g>
            </svg>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 px-4 py-3 border-y border-white/5">
            <StatBox icon={Gauge} label="SPEED" value={`${drone.speed}`} unit="kts" />
            <StatBox icon={Crosshair} label="ALT" value={`${drone.altitude}`} unit="ft" />
            <StatBox icon={Signal} label="SIG" value={`${drone.signal}`} unit="dB" />
          </div>

          {/* Battery */}
          <div className="px-4 py-3">
            <div className="flex justify-between font-mono text-[10px] text-muted-foreground mb-1">
              <span>BATTERY</span>
              <span className={drone.battery < 20 ? 'text-status-critical' : 'text-primary'}>{Math.round(drone.battery)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  drone.battery > 30 ? 'bg-primary' : drone.battery > 15 ? 'bg-status-warning' : 'bg-status-critical'
                }`}
                animate={{ width: `${drone.battery}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Cargo */}
          <div className="px-4 py-3 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Package size={12} className="text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider">CARGO MANIFEST</span>
            </div>
            {drone.cargo ? (
              <div className="glass-panel p-2">
                <p className="font-mono text-xs text-foreground">{drone.cargo}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{drone.cargoWeight} kg</p>
              </div>
            ) : (
              <p className="font-mono text-[10px] text-muted-foreground italic">No cargo assigned</p>
            )}
          </div>

          {/* Live Feed placeholder */}
          <div className="px-4 py-3 border-t border-white/5">
            <div className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">LIVE FEED</div>
            <div className="bg-muted/30 rounded h-24 flex items-center justify-center border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
              <span className="font-mono text-[10px] text-muted-foreground z-10">
                {drone.status === 'delivering' ? '● LIVE' : 'NO SIGNAL'}
              </span>
              {drone.status === 'delivering' && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-status-critical animate-pulse" />
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-auto px-4 py-3 border-t border-white/5 flex gap-2">
            <button className="flex-1 glass-panel py-2 px-3 font-mono text-[10px] text-status-critical hover:bg-status-critical/10 transition-colors flex items-center justify-center gap-1.5">
              <AlertTriangle size={11} />
              EMER. LAND
            </button>
            <button className="flex-1 glass-panel py-2 px-3 font-mono text-[10px] text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5">
              <Plane size={11} />
              RTB
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatBox({ icon: Icon, label, value, unit }: { icon: React.ElementType; label: string; value: string; unit: string }) {
  return (
    <div className="text-center">
      <Icon size={12} className="text-muted-foreground mx-auto mb-1" />
      <div className="font-mono text-sm text-foreground">{value}<span className="text-[9px] text-muted-foreground ml-0.5">{unit}</span></div>
      <div className="font-mono text-[8px] text-muted-foreground">{label}</div>
    </div>
  );
}
