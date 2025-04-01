const qrcode = require('qrcode');

async function gerarQRCodePix(valor, pedidoId) {
  try {
    // Garantir que o valor seja um número
    const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : Number(valor);

    // Dados do PIX (usando variáveis de ambiente)
    const pixData = {
      chave: process.env.PIX_KEY || '70052367000134', // CNPJ da empresa
      nome: process.env.PIX_NAME || 'LAUDORRT SERVICOS DE ENGENHARIA',
      cidade: process.env.PIX_CITY || 'SAO PAULO',
      valor: valorNumerico.toFixed(2),
      identificador: `LAUDORRT${pedidoId.substring(0, 15)}` // Identificador único do pedido
    };

    // Montar o payload do PIX
    const payload = montarPayloadPix(pixData);

    // Gerar QR Code
    const qrCodeDataURL = await qrcode.toDataURL(payload);

    return {
      qrcode: qrCodeDataURL,
      payload,
      valor: valorNumerico,
      identificador: pixData.identificador
    };
  } catch (error) {
    console.error('Erro ao gerar QR Code PIX:', error);
    throw error;
  }
}

function montarPayloadPix(pixData) {
  // Função auxiliar para calcular CRC16
  function crc16(str) {
    const crcTable = [];
    for (let i = 0; i < 256; i++) {
      let r = i << 8;
      for (let j = 0; j < 8; j++) {
        r = ((r & (1 << 15)) ? ((r << 1) ^ 0x1021) : (r << 1)) & 0xFFFF;
      }
      crcTable[i] = r;
    }

    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc = (crc << 8) ^ crcTable[((crc >> 8) ^ str.charCodeAt(i)) & 0xFF];
    }
    return crc & 0xFFFF;
  }

  // Função auxiliar para formatar campos do payload
  function formatField(id, value) {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  }

  // Montar payload
  let payload = '';
  
  // Payload Format Indicator
  payload += formatField('00', '01');
  
  // Merchant Account Information
  let merchantAccount = formatField('26', '12345678');
  merchantAccount += formatField('27', '20');
  merchantAccount += formatField('00', pixData.chave);
  payload += formatField('26', merchantAccount);
  
  // Merchant Category Code
  payload += formatField('52', '0000');
  
  // Transaction Currency
  payload += formatField('53', '986');
  
  // Country Code
  payload += formatField('58', 'BR');
  
  // Merchant Name
  payload += formatField('59', pixData.nome);
  
  // Merchant City
  payload += formatField('60', pixData.cidade);
  
  // Additional Data Field
  payload += formatField('62', formatField('05', pixData.identificador));
  
  // Transaction Amount
  if (pixData.valor) {
    payload += formatField('54', pixData.valor);
  }
  
  // CRC16
  payload += '6304';
  const crc = crc16(payload).toString(16).toUpperCase().padStart(4, '0');
  payload += crc;

  return payload;
}

module.exports = {
  gerarQRCodePix
}; 