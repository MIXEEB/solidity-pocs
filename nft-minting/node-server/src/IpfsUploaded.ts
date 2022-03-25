import { NFTStorage, File } from "nft.storage";
import fs from 'fs';
import mime from 'mime';
import path from 'path';

const STORAGE_KEY = "[ENTER_STORAGE_KEY]";

interface FileInfo {
  path: string,
  name: string,
  description: string,
}

class IpfsUploader {
  upload = async(fileInfo: FileInfo) => { 
    const fileContent = await fs.promises.readFile(fileInfo.path);
    const type = mime.getType(fileInfo.path) || "";

    const nftStorage = new NFTStorage({token: STORAGE_KEY});
    return await nftStorage.store({
      image: new File([fileContent], path.basename(fileInfo.path), { type }),
      name: fileInfo.name,
      description: fileInfo.description
    });
  }
}

export {
  FileInfo,
  IpfsUploader
}