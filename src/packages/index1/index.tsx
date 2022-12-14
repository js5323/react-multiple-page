import React from 'react';
import { createRoot } from 'react-dom/client';
import svgImg from '../../assets/test.svg';
import jpgImg from '../../assets/test.jpg';

import '@/styles/main.scss';
import './style.scss';

const Element = (
  <div>
    <img src={svgImg} alt='' />
    <img src={jpgImg} alt='' />
    hello ~ ~
    <svg />
  </div>
);

const root = createRoot(document.querySelector('#root'));
root.render(Element);
