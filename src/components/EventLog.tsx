import { useDashboard } from '@/context/DashboardContext';
import { FleetEvent } from '@/types/drone';
import { ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KIND_COLOR: Record<string, string> = {
  arrival: 'text-primary',
  departure: 'text-status-delivering',
  status_change: 'text-status-warning',
  system: 'text-status-critical',
};

const KIND_PREFIX: Record<string, string> = {
  arrival: '▼ ARR',
  departure: '▲ DEP',
  status_change: '◆ STS',
  system: '⚡ SYS',
};

function EventRow({ event }: { event: FleetEvent }) {
  const time = event.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-2 px-3 py-1.5 border-b border-white/5 last:border-b-0"
    >
      <span className="font-mono text-[9px] text-muted-foreground tabular-nums flex-shrink-0 mt-px">
        {time}
      </span>
      <span className={`font-mono text-[9px] flex-shrink-0 mt-px ${KIND_COLOR[event.kind]}`}>
        {KIND_PREFIX[event.kind]}
      </span>
      <span className="font-mono text-[10px] text-foreground/80 leading-tight">
        {event.message}
      </span>
    </motion.div>
  );
}

export default function EventLog() {
  const { events } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  return (
    <div className="glass-panel-solid flex flex-col overflow-hidden" style={{ width: 320, maxHeight: collapsed ? 36 : 220 }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center justify-between px-3 py-2 border-b border-white/5 flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <ScrollText size={12} className="text-primary" />
          <span className="font-mono text-[10px] text-primary tracking-wider">EVENT LOG</span>
          <span className="font-mono text-[9px] text-muted-foreground">{events.length}</span>
        </div>
        {collapsed ? <ChevronUp size={12} className="text-muted-foreground" /> : <ChevronDown size={12} className="text-muted-foreground" />}
      </button>

      {!collapsed && (
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <AnimatePresence initial={false}>
            {events.slice(-50).map(e => (
              <EventRow key={e.id} event={e} />
            ))}
          </AnimatePresence>
          {events.length === 0 && (
            <div className="px-3 py-4 font-mono text-[10px] text-muted-foreground text-center">
              AWAITING TELEMETRY...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
