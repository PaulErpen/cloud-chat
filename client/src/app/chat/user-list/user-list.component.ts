import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserListService } from './services/user-list.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements OnInit {
  users: object[] = [];

  constructor(private userlistservice: UserListService) {
  }

  ngOnInit() {
    this.userlistservice.getUsers().subscribe((users) => {
      this.setUserList(users);
    });;
  }

  setUserList(users) {
    this.users = users;
  }

}
