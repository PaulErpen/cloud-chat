import { Component, OnInit } from '@angular/core';
import { UserListService } from './services/user-list.service';
import { OnlineUser } from '../../../_models/online_user';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements OnInit {
  users: OnlineUser[] = [];

  constructor(private userlistservice: UserListService) { }

  ngOnInit() {
    this.userlistservice.getUsers().subscribe((users) => {
      this.setUserList(users);
    });;
  }

  setUserList(users) {
    this.users = users;
  }

  clickUser($event) {
    this.users = this.userlistservice.clickUser($event);
  }
}
