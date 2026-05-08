const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('mantra_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const supabase = {
  auth: {
    getSession: async () => {
      const token = localStorage.getItem('mantra_token');
      const user = localStorage.getItem('mantra_user');
      return { data: { session: token ? { user: JSON.parse(user || '{}') } : null } };
    },
    onAuthStateChange: (callback: any) => {
      // Mocked
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    updateUser: async () => ({ error: 'Not implemented in Custom API' }),
  },
  functions: {
    invoke: async (functionName: string, options?: { body: any }) => {
      try {
        let route = '';
        if (['analyze-cv', 'free-cv-check'].includes(functionName)) {
          route = `/ai/${functionName}`;
        } else if (['get-prompts', 'get-module-content', 'validate-quiz'].includes(functionName)) {
          route = `/modules/${functionName}`;
        } else if (functionName === 'activate-user') {
          route = '/admin/activate-user';
        } else {
          throw new Error(`Unknown function: ${functionName}`);
        }

        const res = await fetch(`${API_URL}${route}`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(options?.body || {})
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to invoke function');

        return { data, error: null };
      } catch (error: any) {
        return { data: null, error };
      }
    }
  },
  from: (table: string) => {
    // Quick in-memory / localStorage DB for cv_data to support drafts without a real DB table
    const getLocalDB = () => JSON.parse(localStorage.getItem('mock_db_' + table) || '[]');
    const saveLocalDB = (data: any) => localStorage.setItem('mock_db_' + table, JSON.stringify(data));
    
    let currentData = getLocalDB();
    let isCountOnly = false;
    
    const queryBuilder = {
      select: (fields?: string, options?: any) => {
        if (options?.head) isCountOnly = true;
        return queryBuilder;
      },
      eq: (column: string, value: any) => {
        currentData = currentData.filter((row: any) => row[column] === value);
        return queryBuilder;
      },
      order: (column: string, options?: any) => {
        currentData.sort((a: any, b: any) => {
          if (a[column] < b[column]) return options?.ascending ? -1 : 1;
          if (a[column] > b[column]) return options?.ascending ? 1 : -1;
          return 0;
        });
        return { data: isCountOnly ? null : currentData, count: isCountOnly ? currentData.length : null, error: null };
      },
      single: () => {
        return { data: currentData[0] || null, error: currentData[0] ? null : { message: 'Row not found' } };
      },
      insert: (payload: any) => {
        const id = crypto.randomUUID();
        const newRow = { ...payload, id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        const db = getLocalDB();
        db.push(newRow);
        saveLocalDB(db);
        currentData = [newRow];
        return queryBuilder;
      },
      update: (payload: any) => {
        let db = getLocalDB();
        return {
          eq: (column: string, value: any) => {
            db = db.map((row: any) => row[column] === value ? { ...row, ...payload, updated_at: new Date().toISOString() } : row);
            saveLocalDB(db);
            return { error: null };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            let db = getLocalDB();
            db = db.filter((row: any) => row[column] !== value);
            saveLocalDB(db);
            return { error: null };
          }
        };
      },
      then: (resolve: any) => resolve({ data: isCountOnly ? null : currentData, count: isCountOnly ? currentData.length : null, error: null })
    };
    
    return queryBuilder as any;
  }
};
