import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  private url = 'http://localhost:3000';
  private socket;

  constructor() {
    this.socket = io(this.url);
   }

  public getUsers = () => {
    return Observable.create((observer) => {
        this.socket.on('user update', (userlist) => {
            observer.next(userlist.users);
        });
    });
}
}
