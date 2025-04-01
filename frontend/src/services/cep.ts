import axios from 'axios';

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const CEPService = {
  async buscarCEP(cep: string): Promise<ViaCEPResponse> {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new Error('CEP inválido');
    }

    const response = await axios.get<ViaCEPResponse>(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return response.data;
  },
};
