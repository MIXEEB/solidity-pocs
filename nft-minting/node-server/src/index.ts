import ImgHash from './ImgHash';
import express from 'express';
import cors from 'cors';
import bp from 'body-parser';
const DWARF_MINER_PNG = './assets/dwarf-miner.png';

const app = express();
app.use(cors())
app.use(bp.json({limit: '100mb'}));
app.use(express.json({limit: '100mb'}));

console.log('cors enabled');
app.get('/', function(req, res) {
  res.send('Hello NFT');

})

app.post('/bytes', async function(req, res) {
  console.log('received bytes');
  
  const { image } = req.body;

  const imgHash = new ImgHash();
  const _hash = await imgHash.getHashOfRaw(image.toString());
  console.log(_hash);
  res.send('ok');
})

console.log("listening on port 3001");
app.listen(3001);