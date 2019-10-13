import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../user";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regOK: boolean;
  regWas: boolean;
  serverUrl : string;
  currentLocation : string;
  upperLocation: string;
  user: User;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.currentLocation = window.location.href;
    this.upperLocation = this.currentLocation.substring(0,this.currentLocation.lastIndexOf('/'));
    this.serverUrl = "https://assimilite.herokuapp.com/";
    this.user = JSON.parse(localStorage.getItem("user"));
    this.regOK = false;
    this.regWas = false;
  }

  postInputValue() {
    let isAdmin : boolean;
    if (document.getElementById("isAdmin") == null) {
      { isAdmin = false}
    } else {
      isAdmin = ((<HTMLInputElement> document.getElementById("isAdmin")).checked);
    };
    let name = (<HTMLInputElement> document.getElementById("name")).value;
    let email = (<HTMLInputElement> document.getElementById("email")).value;
    let password = (<HTMLInputElement> document.getElementById("password")).value;
    let currentUser: UserReg = {user:{email: email, password: password, name: name, type: +isAdmin}};
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    this.http.post<UserReg>(`${this.serverUrl}auth/register`, currentUser, options).subscribe(
      val => {
        console.log('post call successful value returned in body',
          val);
        this.regOK = true;
        this.regWas = true;
      },
      response => {
        console.log('post call in error', response);
        this.regOK = false;
        this.regWas = true;
      },
      () => {
        console.log('The post observable is now completed.');
      }
    );
  }

}

export class UserReg {
  user: {
    email: string;
    password: string;
    name: string;
    type: number;
  }
}
