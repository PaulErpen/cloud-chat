import { Component, OnInit } from '@angular/core';
import { OnlineUser } from '../../_models/online_user';
import { UserListService } from './services/user-list.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements OnInit {
  users: OnlineUser[] = [];

  constructor(private userlistservice: UserListService) {
  }

  ngOnInit() {
    this.userlistservice.getUsers().subscribe((users) => {
      this.setUserList(users);
    });;
  }

  setUserList(users) {
    var newUsers: OnlineUser[] = [];
    
    for (let user of users) {
      var isSelected = false;

      for (let oldUser of this.users) {
        if(oldUser.username == user) isSelected = oldUser.isSelected;
      }

      newUsers.push({"username": user, "isSelected": isSelected});
    }

    this.users = newUsers;
  }

  clickUser($event) {
    var username = $event.currentTarget.dataset.username;

    for(let user of this.users) {
      if(user.username == username) user.isSelected = !user.isSelected;
    }
  }

}
