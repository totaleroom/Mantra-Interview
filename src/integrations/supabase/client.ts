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
    const queryBuilder = {
      select: (fields?: string, options?: any) => {
        return queryBuilder;
      },
      eq: (column: string, value: any) => {
        (queryBuilder as any)._filters = (queryBuilder as any)._filters || {};
        (queryBuilder as any)._filters[column] = value;
        return queryBuilder;
      },
      order: (column: string, options?: any) => {
        return queryBuilder;
      },
      single: async () => {
        try {
          let url = '';
          if (table === 'profiles') url = `${API_URL}/profile`;
          else if (table === 'cv_data') url = `${API_URL}/cv`;
          else throw new Error(`Table ${table} not supported in single()`);

          const res = await fetch(url, { headers: getAuthHeaders() });
          const data = await res.json();
          
          // If it's cv_data and we have filters, find the one
          if (table === 'cv_data' && (queryBuilder as any)._filters?.id) {
             const item = data.find((d: any) => d.id === (queryBuilder as any)._filters.id);
             return { data: item || null, error: item ? null : { message: 'Not found' } };
          }

          return { data: Array.isArray(data) ? data[0] : data, error: null };
        } catch (error: any) {
          return { data: null, error };
        }
      },
      insert: async (payload: any) => {
        try {
          const res = await fetch(`${API_URL}/cv`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          return { data: [data], error: null };
        } catch (error: any) {
          return { data: null, error };
        }
      },
      update: (payload: any) => {
        return {
          eq: async (column: string, value: any) => {
            try {
              let url = '';
              if (table === 'profiles') url = `${API_URL}/profile`;
              else if (table === 'cv_data') url = `${API_URL}/cv/${value}`;
              
              const res = await fetch(url, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
              });
              const data = await res.json();
              return { data, error: null };
            } catch (error: any) {
              return { data: null, error };
            }
          }
        };
      },
      delete: () => {
        return {
          eq: async (column: string, value: any) => {
            try {
              const res = await fetch(`${API_URL}/cv/${value}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
              });
              return { error: null };
            } catch (error: any) {
              return { error };
            }
          }
        };
      },
      then: async (resolve: any) => {
        try {
          let url = '';
          if (table === 'profiles') url = `${API_URL}/profile`;
          else if (table === 'cv_data') url = `${API_URL}/cv`;
          
          const res = await fetch(url, { headers: getAuthHeaders() });
          const data = await res.json();
          resolve({ data: Array.isArray(data) ? data : [data], error: null });
        } catch (error: any) {
          resolve({ data: null, error });
        }
      }
    };
    
    return queryBuilder as any;
  }
};
