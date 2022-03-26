import { useState } from 'react';
import dwarfMiner from '../assets/dwarf-miner.png'
import axios from 'axios';

export default function NtfImage(props) {

  const [dwf, setDwf] = useState("");
  const [deg, setDeg] = useState(47);

  const clearImg = () => {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const image = document.getElementById("source");
    ctx.clearRect(0, 0, image.width, image.height);

    //console.log('imagedata', image.width, image.height);
    //ctx.drawImage(image, 0, 0, image.width, image.height,  0, 0, image.width, image.height);
    //ctx.drawImage(image, 0, 0);
    //ctx.filter = 'hue-rotate(47deg)';
  }

  const process = () => {
    
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d"); 

    const image = document.getElementById("source");
    ctx.clearRect(0, 0, image.width, image.height);

    //console.log('imagedata', image.width, image.height);
    //ctx.drawImage(image, 0, 0, image.width, image.height,  0, 0, image.width, image.height);
    
    //ctx.filter = `hue-rotate(47deg)`; //`hue-rotate(${deg}deg)`
    ctx.filter = `hue-rotate(${deg}deg)`
    console.log('export filter', ctx.filter);
    ctx.drawImage(image, 0, 0);
  }

  const extractImageData = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d"); 

    //debugger
    const imageData = ctx.getImageData(0, 0, 412, 468);
    
    axios.post("http://localhost:3001/bytes", {
      image: canvas.toDataURL('image/png')
      //imageData.data
    }).then((res) => {
      console.log(res)
    })
  }

  const saveImage = () => {
    const canvas = document.getElementById("canvas");
    //console.log(canvas.toDataURL('image/png'))

    setDwf(canvas.toDataURL('image/png'));
  }

     
  const data= "";

  return (<div className="ImageContainer">
    <input value={deg} onChange={(e) => setDeg(e.target.value)}></input>

    <button className="ComicButtons" onClick={() => clearImg()}>Clear</button>
    <button className="ComicButtons" onClick={() => process()}>Copy to canvas</button>
    <button className="ComicButtons" onClick={() => extractImageData()}>GetImageData</button>
    <button className="ComicButtons" onClick={ () => saveImage()} >Test</button>
    <img id="source" src={dwarfMiner}></img>
    
    <canvas width={412} height={468} id="canvas"></canvas>

    <div>
      <img src={dwf}></img>
    </div>
  </div>
  )

}