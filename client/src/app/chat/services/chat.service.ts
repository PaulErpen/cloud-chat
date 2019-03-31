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
        var username = JSON.parse(localStorage.getItem("currentUser")).username;
        var messageData = {
            "message": username +
                " entered the chatroom.",
            "username": username
        };
        
        this.socket.emit('chat login', messageData);
    }

    public sendLogoutMessage(user) {
        var username = user.username;
        var messageData = {
            "message": username +
                " entered the chatroom.",
            "username": username
        };
        this.socket.emit('chat logout', messageData);
    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
        });
    }
}
