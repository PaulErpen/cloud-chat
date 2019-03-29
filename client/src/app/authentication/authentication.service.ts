import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    
    login(username: string, password: string) {
      return this.http.post('http://localhost:3000'+'/login', 
      {"username":username, "password":password}).toPromise();
    }

    register(username: string, password: string) {
        return this.http.post('http://localhost:3000'+'/register', 
        {"username":username, "password":password}).toPromise()
        .then(
            (res) => this.validateLogin(res)
        );
    }

    validateLogin(res) {
        if(res) {
            debugger;
        }
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}