import ImgHash from './ImgHash';

const DWARF_MINER_PNG = './assets/dwarf-miner.png';

const runApp = async () => {
  const imgHash = new ImgHash();
  console.log(await imgHash.getHash(DWARF_MINER_PNG));
} 
(async () => await runApp())();