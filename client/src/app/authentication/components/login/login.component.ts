import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.username, this.password);
  }

}
