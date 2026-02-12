import { useDashboard } from '@/context/DashboardContext';
import { Shield, CloudLightning, Zap, Activity } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GodMode() {
  const { stormMode, toggleStorm, triggerEMP, drones } = useDashboard();
  const [open, setOpen] = useState(false);

  const activeDrones = drones.filter(d => d.status === 'delivering').length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass-panel px-3 py-1.5 font-mono text-[10px] text-status-critical hover:bg-status-critical/10 transition-colors flex items-center gap-1.5 tracking-wider"
      >
        <Shield size={12} />
        OVERRIDE
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 glass-panel-solid w-96 p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-status-critical" />
                  <h2 className="font-mono text-sm text-status-critical tracking-wider text-glow-red">GOD MODE</h2>
                </div>
                <button onClick={() => setOpen(false)} className="font-mono text-xs text-muted-foreground hover:text-foreground">
                  [ESC]
                </button>
              </div>

              {/* Status */}
              <div className="glass-panel p-3 mb-4 flex items-center gap-3">
                <Activity size={14} className="text-primary" />
                <div>
                  <div className="font-mono text-xs text-foreground">{activeDrones} drones active</div>
                  <div className="font-mono text-[10px] text-muted-foreground">Fleet status nominal</div>
                </div>
              </div>

              {/* Storm Protocol */}
              <div className="flex items-center justify-between p-3 glass-panel mb-3">
                <div className="flex items-center gap-2">
                  <CloudLightning size={14} className={stormMode ? 'text-status-warning' : 'text-muted-foreground'} />
                  <div>
                    <div className="font-mono text-xs text-foreground">Storm Protocol</div>
                    <div className="font-mono text-[9px] text-muted-foreground">Reduce speed, activate hazard mode</div>
                  </div>
                </div>
                <button
                  onClick={toggleStorm}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    stormMode ? 'bg-status-warning' : 'bg-muted'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-foreground"
                    animate={{ left: stormMode ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* EMP Blast */}
              <button
                onClick={triggerEMP}
                className="w-full p-3 glass-panel font-mono text-xs text-status-critical hover:bg-status-critical/10 transition-colors flex items-center gap-2 justify-center"
              >
                <Zap size={14} />
                EMP BLAST — RESET ALL TARGETS
              </button>

              <p className="font-mono text-[9px] text-muted-foreground mt-4 text-center">
                ⚠ Actions affect all drones in the fleet
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
