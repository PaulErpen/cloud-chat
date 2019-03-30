import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication/authentication.service';
import { User } from '../_models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-masthead',
  templateUrl: './masthead.component.html',
  styleUrls: ['./masthead.component.less']
})
export class MastheadComponent implements OnInit {
  user: User;
  loggedin: boolean;

  constructor(private auth:AuthenticationService, private router: Router) { }

  ngOnInit() {
    if(this.auth.currentUserValue != undefined) {
      this.updateUser(this.auth.currentUserValue);
    }
    this.auth.currentUser.subscribe({
      next: userValue => this.updateUser(userValue)
    });
  }

  logout() {
    this.auth.logout();
  }

  updateUser(userValue) {
    if(userValue != undefined) {
      this.loggedin = true;
      this.user = userValue;
    } else {
      this.loggedin = false;
    }
  }

}
