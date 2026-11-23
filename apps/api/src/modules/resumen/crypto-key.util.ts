import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const ALGORITMO = 'aes-256-gcm';

function obtenerClaveMaestra(): Buffer {
  const secret = process.env.IA_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('Falta configurar IA_ENCRYPTION_KEY en las variables de entorno');
  }
  return createHash('sha256').update(secret).digest();
}

export function encriptarApiKey(apiKeyPlana: string): string {
  const key = obtenerClaveMaestra();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITMO, key, iv);

  const encriptado = Buffer.concat([cipher.update(apiKeyPlana.trim(), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encriptado.toString('hex')}`;
}

export function desencriptarApiKey(payload: string): string {
  const [ivHex, authTagHex, dataHex] = payload.split(':');
  if (!ivHex || !authTagHex || !dataHex) {
    throw new Error('Formato de API Key cifrada inválido');
  }

  const key = obtenerClaveMaestra();
  const decipher = createDecipheriv(ALGORITMO, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  const desencriptado = Buffer.concat([
    decipher.update(Buffer.from(dataHex, 'hex')),
    decipher.final(),
  ]);

  return desencriptado.toString('utf8');
}