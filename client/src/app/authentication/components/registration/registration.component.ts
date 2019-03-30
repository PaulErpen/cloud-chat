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
  error: string;

  constructor(private auth: AuthenticationService, private router : Router) { }

  ngOnInit() {
  }

  register() {
    this.auth.register(this.username, this.password).then(
      (res) => this.registerRedirect(res)
    );
  }

  registerRedirect(res) {
    if(res != false) {
      this.router.navigate(["/"]);
    } else {
      this.error = "Registration failed!";
    }
  }

}
