import { useState, useEffect } from 'react';
import dwarfMiner from '../assets/dwarf-miner.png'
import axios from 'axios';

export default function NtfImage(props) {
  const [deg, setDeg] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const image = new Image();

  const init = () => {
    image.src = dwarfMiner;
    image.onload = () => {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
    }
  }

  useEffect(function(){
    if (!initialized) {
      init();
      setInitialized(true);
      return;
    }
    refreshCanvas(deg);
  })

  const refreshCanvas = (_deg) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("hiddenSource");
  
    ctx.clearRect(0, 0, 412, 468);
    ctx.filter = `hue-rotate(${_deg}deg)`
    ctx.drawImage(image, 0, 0);
  }

  const sendImageData = () => {
    const canvas = document.getElementById("canvas");
    axios.post("http://localhost:3001/sign", {
      image: canvas.toDataURL('image/png')
    }).then((res) => {
      console.log(res);
    })
  }
  const updateDegree = (value) => {
    setInitialized(true);
    setDeg(value);
  }

  const [storedImages, setStoredImages] = useState([])
  const storeImage = () => {
    const canvas = document.getElementById("canvas");
    setStoredImages([...storedImages, canvas.toDataURL('image/png')])
  }

  return (<div className='ImageGeneratorContainer'>
    <input type="range" min="0" max="359" value={deg} id="myRange" onChange={(e) => updateDegree(e.target.value)}/>
    <button className="ComicButton" onClick={() => sendImageData()}>Send</button>
    <img id="hiddenSource" className='HiddenImage' src={dwarfMiner}></img>    
    <canvas width={412} height={468} id="canvas"></canvas>
  </div>)
}

