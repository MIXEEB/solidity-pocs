import ImgHash from './ImgHash';
import express from 'express';
import cors from 'cors';
import bp from 'body-parser';
import Signer from './Signer';
const DWARF_MINER_PNG = './assets/dwarf-miner.png';

const app = express();
app.use(cors())
app.use(bp.json({limit: '100mb'}));
app.use(express.json({limit: '100mb'}));

app.post('/sign', async function(req, res) {
  const { image } = req.body;
  const imgHash = new ImgHash();
  const hash = await imgHash.getHashOfRaw(image.toString());

  const signer = new Signer();
  const tokenId = 1;
  const signature = await signer.signEncodedImageHash(tokenId, hash);

  res.send(signature);
});

console.log('listening...');
app.listen(3001);