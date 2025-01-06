import { randomBytes } from 'crypto';
import { encrypt as encryptMM } from '@metamask/eth-sig-util';
import {
  decrypt as decryptEC,
  encrypt as encryptEC,
  PrivateKey,
} from 'eciesjs';
import { aesDecrypt, aesEncrypt } from 'eciesjs/dist/utils';
import { IProvider } from '@web3auth/base';

export class CryptoWallet {
  private SCHEME_VERSION: Readonly<string> = 'x25519-xsalsa20-poly1305';
  private ACCOUNT: Readonly<string> = '';
  private PROVIDER: IProvider | null;

  constructor(account: string, provider: IProvider | null) {
    this.ACCOUNT = account;
    this.PROVIDER = provider;
  }

  async encryptString(str: string): Promise<Buffer> {
    return this.encrypt(Buffer.from(str, 'utf-8'));
  }

  async encrypt(data: Buffer): Promise<Buffer> {
    const keyB64: string = (await this.PROVIDER?.request?.({
      method: 'eth_getEncryptionPublicKey',
      params: [this.ACCOUNT],
    })) as string;

    const publicKey = Buffer.from(keyB64, 'base64');

    const enc = encryptMM({
      publicKey: publicKey.toString('base64'),
      data: data.toString('base64'),
      version: this.SCHEME_VERSION,
    });

    const buf = Buffer.concat([
      Buffer.from(enc.ephemPublicKey, 'base64'),
      Buffer.from(enc.nonce, 'base64'),
      Buffer.from(enc.ciphertext, 'base64'),
    ]);

    return buf;
  }

  async decrypt(data: Buffer): Promise<Buffer> {
    const structuredData = {
      version: this.SCHEME_VERSION,
      ephemPublicKey: data.slice(0, 32).toString('base64'),
      nonce: data.slice(32, 56).toString('base64'),
      ciphertext: data.slice(56).toString('base64'),
    };
    console.log('structuredData', structuredData);

    const ct = `0x${Buffer.from(
      JSON.stringify(structuredData),
      'utf8'
    ).toString('hex')}`;

    // const _decrypt = await this.PROVIDER?.sendAsync({
    //   method: 'eth_decrypt',
    //   params: [ct, this.ACCOUNT],
    // });
    // console.log('ct', ct);

    const decrypt = (await this.PROVIDER?.request?.({
      method: 'eth_decrypt',
      params: [ct, this.ACCOUNT],
    })) as string;
    console.log('decrypt', decrypt);

    return Buffer.from(decrypt, 'base64');
  }
}

export class CryptoECIES {
  private sk: PrivateKey;

  constructor(secret: Buffer) {
    this.sk = new PrivateKey(secret);
  }

  static encrypt(publicKey: string | Buffer, data: Buffer): Buffer {
    return encryptEC(publicKey, data);
  }

  decrypt(data: Buffer): Buffer {
    return decryptEC(this.sk.toHex(), data);
  }

  encrypt(data: Buffer): Buffer {
    return CryptoECIES.encrypt(this.getPublicKey(), data);
  }

  getPublicKey(): string {
    return this.sk.publicKey.toHex();
  }
}

export class CryptoAES256 {
  private key: Buffer;

  constructor(key: Buffer) {
    this.key = key;
  }

  decrypt(data: Buffer): Buffer {
    return aesDecrypt(this.key, data);
  }

  encrypt(data: Buffer): Buffer {
    return aesEncrypt(this.key, data);
  }
}

export function generateSecret(): Buffer {
  return randomBytes(32);
}
