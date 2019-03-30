import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from "./chat/chat.component";
import {AuthGuard} from "./_guards/auth.guard";
import {LoginComponent} from "./authentication/components/login/login.component";
import {RegistrationComponent} from "./authentication/components/registration/registration.component";

const routes : Routes = [
  {path: '', component:ChatComponent, canActivate: [AuthGuard]},
  {path: 'login', component:LoginComponent},
  {path: 'registration', component:RegistrationComponent}
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
