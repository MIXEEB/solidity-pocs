import web3 from 'web3';
import fs from 'fs';

export default class ImgHash {

  getHash = async (filePath: string) => {
    const file = await fs.promises.readFile(filePath)
    const stringifiedBuffer = file.toString('utf8');
    return web3.utils.keccak256(stringifiedBuffer);
  }

  getHashOfRaw = async(rawFile: string) => {
    return web3.utils.keccak256(rawFile);
  }
}