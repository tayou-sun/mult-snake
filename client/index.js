import './css/common.css';
import { connect, play} from './connection';
import {draw} from './render'

var send_button = document.getElementById("send_button");


send_button.onclick = _ => {
  play("name");
}

function start(){
  connect().then(_=>{
    draw();
  });
}

start();