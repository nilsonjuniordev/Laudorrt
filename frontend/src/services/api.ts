import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Redirecionar para a página de login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const PedidoService = {
  async criar(formData: FormData) {
    try {
      const response = await api.post('/pedidos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  uploadAnexos: async (pedidoId: string, formData: FormData) => {
    try {
      const response = await api.post(`/pedidos/${pedidoId}/anexos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload de anexos:', error);
      throw error;
    }
  },

  buscarPorId: async (id: string) => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw error;
    }
  },

  listar: async () => {
    try {
      const response = await api.get('/pedidos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      throw error;
    }
  },

  excluir: async (id: string) => {
    try {
      const response = await api.delete(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      throw error;
    }
  },

  downloadAnexo: async (pedidoId: string, anexoId: string) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}/anexos/${anexoId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar anexo:', error);
      throw error;
    }
  },

  downloadPlanilha: async (pedidoId: string) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}/planilha`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar planilha:', error);
      throw error;
    }
  },
};
