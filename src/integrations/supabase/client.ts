// ── Type definitions for the API client layer ──

interface AuthSession {
  user: Record<string, unknown>;
}

interface SessionResponse {
  data: { session: AuthSession | null };
}

interface AuthSubscription {
  unsubscribe: () => void;
}

interface FunctionInvokeOptions {
  body: Record<string, unknown>;
}

interface ApiResponse<T = Record<string, unknown>> {
  data: T | null;
  error: Error | null;
}

interface QueryResult<T = Record<string, unknown>> {
  data: T | T[] | null;
  error: { message: string } | null;
  count?: number | null;
}

interface FilterableQuery {
  _filters: Record<string, string>;
}

// ── API Configuration ──

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('mantra_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// ── Supabase-compatible API Client ──

export const supabase = {
  auth: {
    getSession: async (): Promise<SessionResponse> => {
      const token = localStorage.getItem('mantra_token');
      const user = localStorage.getItem('mantra_user');
      return { data: { session: token ? { user: JSON.parse(user || '{}') } : null } };
    },
    onAuthStateChange: (_callback: (event: string, session: AuthSession | null) => void) => {
      return { data: { subscription: { unsubscribe: () => {} } as AuthSubscription } };
    },
    updateUser: async (): Promise<{ error: string }> => ({ error: 'Not implemented in Custom API' }),
  },
  functions: {
    invoke: async (functionName: string, options?: FunctionInvokeOptions): Promise<ApiResponse> => {
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

        const data: Record<string, unknown> = await res.json();
        if (!res.ok) throw new Error((data.error as string) || 'Failed to invoke function');

        return { data, error: null };
      } catch (error) {
        return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
      }
    }
  },
  from: (table: string) => {
    const filters: Record<string, string> = {};

    const queryBuilder = {
      select: (_fields?: string, _options?: Record<string, unknown>) => {
        return queryBuilder;
      },
      eq: (column: string, value: string) => {
        filters[column] = value;
        return queryBuilder;
      },
      order: (_column: string, _options?: Record<string, unknown>) => {
        return queryBuilder;
      },
      single: async (): Promise<QueryResult> => {
        try {
          let url = '';
          if (table === 'profiles') url = `${API_URL}/profile`;
          else if (table === 'cv_data') url = `${API_URL}/cv`;
          else throw new Error(`Table ${table} not supported in single()`);

          const res = await fetch(url, { headers: getAuthHeaders() });
          const data = await res.json();
          
          if (table === 'cv_data' && filters.id) {
             const item = (data as Record<string, unknown>[]).find(
               (d: Record<string, unknown>) => d.id === filters.id
             );
             return { data: item || null, error: item ? null : { message: 'Not found' } };
          }

          return { data: Array.isArray(data) ? data[0] : data, error: null };
        } catch (error) {
          return { data: null, error: { message: error instanceof Error ? error.message : String(error) } };
        }
      },
      insert: async (payload: Record<string, unknown>) => {
        try {
          const res = await fetch(`${API_URL}/cv`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          return { data: [data], error: null };
        } catch (error) {
          return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
        }
      },
      update: (payload: Record<string, unknown>) => {
        return {
          eq: async (column: string, value: string) => {
            try {
              let url = '';
              if (table === 'profiles') url = `${API_URL}/profile`;
              else if (table === 'cv_data') url = `${API_URL}/cv/${value}`;
              else url = `${API_URL}/${table}/${value}`;
              
              const res = await fetch(url, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
              });
              const data = await res.json();
              return { data, error: null };
            } catch (error) {
              return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
            }
          }
        };
      },
      delete: () => {
        return {
          eq: async (_column: string, value: string) => {
            try {
              await fetch(`${API_URL}/cv/${value}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
              });
              return { error: null };
            } catch (error) {
              return { error: error instanceof Error ? error : new Error(String(error)) };
            }
          }
        };
      },
      then: async (resolve: (result: QueryResult) => void) => {
        try {
          let url = '';
          if (table === 'profiles') url = `${API_URL}/profile`;
          else if (table === 'cv_data') url = `${API_URL}/cv`;
          else url = `${API_URL}/${table}`;
          
          const res = await fetch(url, { headers: getAuthHeaders() });
          const data = await res.json();
          resolve({ data: Array.isArray(data) ? data : [data], error: null });
        } catch (error) {
          resolve({ data: null, error: { message: error instanceof Error ? error.message : String(error) } });
        }
      }
    };
    
    return queryBuilder;
  }
};
