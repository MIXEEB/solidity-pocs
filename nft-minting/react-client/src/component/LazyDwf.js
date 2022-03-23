import React, { Component } from 'react';
import lazydwarf1 from '../assets/lazydwarf1.png'

import head from '../assets/lazydwarf1_head.png'
import body from '../assets/lazydwarf1_body.png'

//function component
export default function LazyDwf(props) {

  const containerStyle = {
    position: 'relative'
  }

  const img1 = {
    position: 'relative',
    top: '0px',
    left: '0px',
    width: '50%'
  }

  const img2 = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '50%'
  }

  return <div style={containerStyle}>
    <img style={img1} src={body}></img>
    <img style={img2} src={head}></img>
  </div>
}