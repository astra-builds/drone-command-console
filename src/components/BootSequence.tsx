import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_MESSAGES = [
  'INIT_CORE_SYSTEMS',
  'CALIBRATING_GPS',
  'LIDAR_ARRAY_OK',
  'THERMAL_SENSORS_OK',
  'MOTOR_CTRL_ENGAGED',
  'BATTERY_CHECK_PASS',
  'COMMS_LINK_ACTIVE',
  'SWARM_SYNC_READY',
  'CONNECTING_GRID...',
  'FLEET_ONLINE',
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'exit'>('boot');

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex(i => {
        if (i >= BOOT_MESSAGES.length - 1) {
          clearInterval(msgTimer);
          return i;
        }
        return i + 1;
      });
    }, 250);

    const exitTimer = setTimeout(() => setPhase('exit'), 2600);
    const completeTimer = setTimeout(onComplete, 3200);

    return () => {
      clearInterval(msgTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase === 'boot' && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.5 }}
        >
          {/* Radar sweep */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              initial={{ top: '-5%' }}
              animate={{ top: '105%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Drone wireframe */}
          <motion.div
            className="relative mb-8"
            animate={{ rotateY: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ perspective: 600 }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="text-primary">
              <g stroke="currentColor" strokeWidth="1.5" fill="none">
                {/* Body */}
                <rect x="45" y="45" width="30" height="30" rx="4" />
                {/* Arms */}
                <line x1="45" y1="50" x2="15" y2="20" />
                <line x1="75" y1="50" x2="105" y2="20" />
                <line x1="45" y1="70" x2="15" y2="100" />
                <line x1="75" y1="70" x2="105" y2="100" />
                {/* Rotors */}
                <circle cx="15" cy="20" r="12" strokeDasharray="4 2" />
                <circle cx="105" cy="20" r="12" strokeDasharray="4 2" />
                <circle cx="15" cy="100" r="12" strokeDasharray="4 2" />
                <circle cx="105" cy="100" r="12" strokeDasharray="4 2" />
                {/* Center dot */}
                <circle cx="60" cy="60" r="3" fill="currentColor" />
              </g>
            </svg>

            {/* Glow overlay that fills in */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-mono text-2xl tracking-[0.3em] text-primary text-glow-cyan mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            SWARM-NET V2
          </motion.h1>
          <p className="font-mono text-xs text-muted-foreground mb-8">AUTONOMOUS FLEET COMMAND</p>

          {/* Terminal messages */}
          <div className="font-mono text-xs text-primary/70 h-6">
            <span className="text-primary/40">{'>'}</span>{' '}
            {BOOT_MESSAGES[messageIndex]}
            <span className="terminal-cursor ml-1">▌</span>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-48 h-0.5 bg-muted rounded overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
