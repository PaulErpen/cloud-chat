import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:3000';
  private socket;

    constructor() {
        this.socket = io(this.url);
    }

    public sendMessage(message) {
        var messageData = {
            "message": message,
            "username": JSON.parse(localStorage.getItem("currentUser")).username
        };
        this.socket.emit('chat message', messageData);
    }

    public sendLoginMessage() {
        var messageData = JSON.parse(localStorage.getItem("currentUser")).username +
            " entered the chatroom.";
        this.socket.emit('chat servermessage', messageData);
    }

    public sendLogoutMessage(user) {
        var messageData = user.username +
            " exited the chatroom.";
        this.socket.emit('chat servermessage', messageData);
    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
        });
    }

    public getUser = () => {
      return Observable.create((observer) => {
        this.socket.on('online users', (user) => {
          observer.next(user);
        });
      });
    }
}
