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
  from: (table: string) => ({
    select: () => ({
      order: () => ({ data: [] }),
      eq: () => ({ single: () => ({ data: null }) }),
    }),
    insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }), error: null }), error: null }),
    update: () => ({ eq: () => ({ error: null }) }),
    delete: () => ({ eq: () => ({ error: null }) })
  })
};
