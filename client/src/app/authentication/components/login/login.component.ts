import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  error: string;

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.username, this.password)
      .then(
        (res) => this.loginRedirect(res)
      );
  }

  loginRedirect(res) {
    if(res != false) {
      this.router.navigate(["/"]);
    } else {
      this.error = "Login failed!";
    }
  }

}
