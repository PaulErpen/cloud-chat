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
    if(this.password == this.password_repeat) {
      this.auth.register(this.username, this.password).then(
        (res) => this.registerRedirect(res)
      );
    } else {
      this.error = "Passwords have to match!";
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
