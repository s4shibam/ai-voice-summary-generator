import { useEffect, useState } from 'react';

type Status = 'checking' | 'up' | 'down';

const useServerStatus = (intervalMs = 30000) => {
  const [status, setStatus] = useState<Status>('checking');

  const check = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
        signal: AbortSignal.timeout(5000)
      });
      setStatus(res.ok ? 'up' : 'down');
    } catch {
      setStatus('down');
    }
  };

  useEffect(() => {
    // Note: Wrapping check() inside a setTimeout to solve the below error:
    // Error: Calling setState synchronously within an effect can trigger cascading renders
    const initialId = setTimeout(check, 0);
    const id = setInterval(check, intervalMs);
    return () => {
      clearTimeout(initialId);
      clearInterval(id);
    };
  }, [intervalMs]);

  return status;
};

export default useServerStatus;
