import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { OnlineUser } from '../../../../_models/online_user';

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  private url = 'http://localhost:3000';
  private socket;
  users: OnlineUser[] = [];

  constructor() {
    this.socket = io(this.url);
   }

  public getUsers = () => {
    return Observable.create((observer) => {
        this.socket.on('user update', (userlist) => {
            observer.next(this.setUserList(userlist.users));
        });
    });
  }

  setUserList(users) {
    var newUsers: OnlineUser[] = [];
    
    for (let user of users) {
      var isSelected = false;

      if(user != JSON.parse(localStorage.getItem("currentUser")).username) {
        for (let oldUser of this.users) {
          if(oldUser.username == user) isSelected = oldUser.isSelected;
        }
  
        newUsers.push({"username": user, "isSelected": isSelected});
      }
    }

    this.users = newUsers;
    return this.users;
  }

  clickUser($event) {
    var username = $event.currentTarget.dataset.username;

    for(let user of this.users) {
      if(user.username == username) user.isSelected = !user.isSelected;
    }

    return this.users;
  }
  
  getSelectedUsers() {
    var ret = [];
    for(let user of this.users) {
      if(user.isSelected) ret.push(user.username);
    }
    return ret;
  }
}
