import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserReg} from "../register/register.component";
import {User} from "../user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentLocation : string;
  upperLocation: string;
  serverUrl : string;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.currentLocation = window.location.href;
    this.upperLocation = this.currentLocation.substring(0,this.currentLocation.lastIndexOf('/'));
    this.serverUrl = "https://assimilite.herokuapp.com/";
  }

  getInputValue() {

    let email = (<HTMLInputElement> document.getElementById("email")).value;
    let password = (<HTMLInputElement> document.getElementById("password")).value;
    let currentUser: UserLogin = {user:{email: email, password: password}};
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    this.http.post<UserLogin>(`${this.serverUrl}auth/login`, currentUser, options).subscribe(
      val => {
        console.log('post call successful value returned in body',
          val);
        let user: User = {
          id: val['id'],
          name: val['name'],
          email: email,
          password: password,
          type: val['type'],
          token: val['auth_token'],
          avatarURL:  '../../favicon.ico'
        };
        localStorage.setItem("user", JSON.stringify(user));
      },
      response => {
        console.log('post call in error', response);
      },
      () => {
        console.log('The post observable is now completed.');
      }
    );
  }
}

export class UserLogin {
  user: {
    email: string;
    password: string;
  }
}
