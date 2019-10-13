import { Component, OnInit } from '@angular/core';
import {User} from '../user';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor() { }
  logout(){
    localStorage.clear();
  }
  ngOnInit() {
  }

}
