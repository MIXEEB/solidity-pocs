import React, { useState } from 'react';
import './ComponentStyles.css';
import InputWithLabel from './InputWithLabel.js'

export default function TokenParameters(props) {
  const {tokenId, metadata, onUpdateTokenId, onUpdateMetadata} = props;

  return <div className="FlexColumnCentered">  
    <InputWithLabel label="Token Id" value={tokenId} onUpdate={(tokenId) => onUpdateTokenId(tokenId)}></InputWithLabel>
    <InputWithLabel label="Metadata" value={metadata} onUpdate={(metadata) => onUpdateMetadata(metadata)}></InputWithLabel>
  </div>
}