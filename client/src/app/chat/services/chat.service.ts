import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { UserListService } from '../components/user-list/services/user-list.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:3000';
  private socket;

    constructor(private userlistservice: UserListService, private http: HttpClient) {
        this.socket = io(this.url);
    }

    public sendMessage(message) {
        var selectedUsers = this.userlistservice.getSelectedUsers();
        if(selectedUsers.length > 0) {
            var messageData = {
                "message": message,
                "username": JSON.parse(localStorage.getItem("currentUser")).username,
                "selectedUsers": selectedUsers
            };
            this.socket.emit('chat message', messageData);
        } else {
            var messageData = {
                "message": message,
                "username": JSON.parse(localStorage.getItem("currentUser")).username,
                "selectedUsers": []
            };
            this.socket.emit('chat broadcast', messageData);
        }
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
                " exited the chatroom.",
            "username": username
        };
        this.socket.emit('chat logout', messageData);
    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new broadcast', (message) => {
                observer.next(message);
            });
            this.socket.on('new message', (message) => {
                observer.next(message);
            });
        });
    }
    public sendFile(formData) {
        var selectedUsers = this.userlistservice.getSelectedUsers();
        formData.append("selectedUsers", selectedUsers.join(";"));
        formData.append("username", JSON.parse(localStorage.getItem("currentUser")).username);
        this.http
        .post(
            "http://localhost:3000/upload", 
            formData,
            {responseType: 'text'}
        ).toPromise()
        .then((res) => console.log(res));
    }
}
