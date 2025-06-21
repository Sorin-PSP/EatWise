import { useEffect } from 'react';
import { useFood } from '../contexts/FoodContext';
import { useAuth } from '../contexts/AuthContext';

export default function DailyLogSync() {
  const { syncDailyLogs } = useFood();
  const { user } = useAuth();
  
  // Sync daily logs when user changes
  useEffect(() => {
    if (user) {
      // Sync logs from localStorage to Supabase when user is authenticated
      syncDailyLogs();
    }
  }, [user, syncDailyLogs]);
  
  // This is a utility component that doesn't render anything
  return null;
}
