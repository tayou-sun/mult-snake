
import io from 'socket.io-client';
const Constants = require('../shared/constraints');
import {processGameUpdate} from './render'
import { throttle } from 'throttle-debounce';

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false })

const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
      console.log('Connected to server!');
      resolve();
    }); 
  });
  
  export const connect = _ => (
    connectedPromise.then(() => {
      socket.on(Constants.MSG_TYPES.UPDATE, processGameUpdate);
      socket.on('disconnect', () => {
        console.log('Disconnected from server.');
      });
    })
  ); 
  
 export const play = username => {
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
  };

  export const updateDirection = throttle(20, dir => {
    dir.socketId = socket.id; 
    socket.emit(Constants.MSG_TYPES.INPUT, dir);
  });