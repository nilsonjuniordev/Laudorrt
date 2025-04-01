import { api } from './api';

class PedidoService {
  async criar(formData: FormData) {
    const response = await api.post('/pedidos', formData);
    return response.data;
  }

  async buscarPorId(id: string) {
    const response = await api.get(`/pedidos/${id}`);
    return {
      pedido: {
        ...response.data.pedido,
        atividades: response.data.atividades || [],
      },
      qr_code_pix: response.data.qr_code_pix,
    };
  }
}

export default new PedidoService();
