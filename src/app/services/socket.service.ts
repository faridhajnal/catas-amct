import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
export class SocketService {
  // Our localhost address that we set in our server code
  private url = 'http://localhost:4000';
  private socket;
   sendMessage(message : any){
    console.log('sending', message);
    this.socket.emit('emit-msg', message);
   }

   getMessages() {
    let observable = new Observable(observer => {

      this.socket.on('evento', (data) => {
        observer.next(data);
      });

    })
    return observable;
  }

  initSocket(){
    this.socket = io(this.url);
  }

  disconnectSocket(){
    this.socket.disconnect();
  }
}
