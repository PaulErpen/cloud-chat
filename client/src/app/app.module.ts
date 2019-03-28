import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Routes, Route, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatService } from './chat/services/chat.service';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './authentication/components/login/login.component';
import { RegistrationComponent } from './authentication/components/registration/registration.component';
import { AuthGuard } from './_guards/auth.guard';

const routes : Routes = [
  {path: '', component:ChatComponent, canActivate: [AuthGuard]},
  {path: 'login', component:LoginComponent},
  {path: 'registration', component:RegistrationComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
    ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
