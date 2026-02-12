import { useState, useCallback } from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import HUDShell from '@/components/HUDShell';
import BootSequence from '@/components/BootSequence';

const Index = () => {
  const [booted, setBooted] = useState(false);
  const handleBootComplete = useCallback(() => setBooted(true), []);

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      <DashboardProvider>
        <HUDShell />
      </DashboardProvider>
    </>
  );
};

export default Index;
