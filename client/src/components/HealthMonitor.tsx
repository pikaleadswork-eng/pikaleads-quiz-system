import { useEffect, useState } from "react";
import { startHealthMonitoring, showConnectionStatus } from "@/lib/connectionMonitor";

/**
 * Health monitoring component
 * Automatically monitors server health and shows connection status
 */
export function HealthMonitor() {
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    const cleanup = startHealthMonitoring((healthy) => {
      setIsHealthy(healthy);
      showConnectionStatus(healthy);
    });

    return cleanup;
  }, []);

  // This component doesn't render anything visible
  // It only manages health monitoring in the background
  return null;
}
