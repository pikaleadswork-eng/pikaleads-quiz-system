/**
 * Connection monitoring and auto-retry logic for tRPC client
 */

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

/**
 * Check server health
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/trpc/health.check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.result?.data?.status === 'healthy';
    }
    
    return false;
  } catch (error) {
    console.error('[Connection Monitor] Health check failed:', error);
    return false;
  }
}

/**
 * Retry failed request with exponential backoff
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  onRetry?: (attempt: number) => void
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`[Connection Monitor] Retry attempt ${attempt}/${MAX_RETRIES} after ${delay}ms`);
        
        if (onRetry) {
          onRetry(attempt);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on authentication errors
      if (error instanceof Error && error.message.includes('UNAUTHORIZED')) {
        throw error;
      }
      
      // Don't retry on validation errors
      if (error instanceof Error && error.message.includes('BAD_REQUEST')) {
        throw error;
      }
      
      console.error(`[Connection Monitor] Request failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);
    }
  }
  
  throw new Error(`Request failed after ${MAX_RETRIES + 1} attempts: ${lastError?.message}`);
}

/**
 * Start periodic health checks
 */
export function startHealthMonitoring(
  onHealthChange: (isHealthy: boolean) => void
): () => void {
  let isHealthy = true;
  
  const checkHealth = async () => {
    const healthy = await checkServerHealth();
    
    if (healthy !== isHealthy) {
      isHealthy = healthy;
      onHealthChange(healthy);
      
      if (!healthy) {
        console.warn('[Connection Monitor] Server health degraded');
      } else {
        console.log('[Connection Monitor] Server health restored');
      }
    }
  };
  
  // Initial check
  checkHealth();
  
  // Periodic checks
  const intervalId = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Show connection status notification
 */
export function showConnectionStatus(isConnected: boolean) {
  const existingNotification = document.getElementById('connection-status-notification');
  
  if (existingNotification) {
    existingNotification.remove();
  }
  
  if (!isConnected) {
    const notification = document.createElement('div');
    notification.id = 'connection-status-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    
    notification.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/>
        <path d="M10 6v4M10 14h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>Втрачено з'єднання з сервером. Спроба підключення...</span>
    `;
    
    document.body.appendChild(notification);
  } else {
    // Show success notification briefly
    const notification = document.createElement('div');
    notification.id = 'connection-status-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    
    notification.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>З'єднання відновлено</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}
