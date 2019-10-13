import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppModule} from "./app.module";
import {LoginComponent} from "./login/login.component";
import {SidebarComponent} from './sidebar/sidebar.component'
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'constructor', component: SidebarComponent},
  { path: '', redirectTo: 'login', pathMatch : 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
