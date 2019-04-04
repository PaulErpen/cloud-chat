import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less']
})
export class RegistrationComponent implements OnInit {
  username: string;
  password: string;
  password_repeat: string;
  error: string;

  constructor(private auth: AuthenticationService, private router : Router) { }

  ngOnInit() {
  }

  register() {
    if(this.password != this.password_repeat) {
      this.error = "Passwords do not match!";      
    } else if(this.username.length < 1) {
      this.error = "Please enter a username!";
    } else if(this.username.length > 20) {
      this.error = "Your username can't be longer than 20 characters!";
    } else if(this.username.includes(";") || this.username.includes(" ")) {
      this.error = "Username can't contain 'spaces' or ';'!";
    } else {
      this.auth.register(this.username, this.password).then(
        (res) => this.registerRedirect(res)
      );
    }
  }

  registerRedirect(res) {
    if(res != false) {
      this.router.navigate(["/"]);
    } else {
      this.error = "Registration failed!";
    }
  }

}
