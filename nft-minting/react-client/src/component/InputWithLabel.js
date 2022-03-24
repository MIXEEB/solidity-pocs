import React, { Component } from 'react';
import './ComponentStyles.css';

export default function InputWithLabel(props) {
  return <div className="FlexColumnCentered">
    <span className='ComicSpan'>{props.label}</span>
    <input value={props.value} className='ComicInput' onChange={(e) => props.onUpdate(e.target.value)}></input>
  </div>
}
