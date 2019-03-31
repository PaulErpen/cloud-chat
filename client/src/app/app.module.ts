import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Routes, Route, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatService } from './chat/services/chat.service';
import { UserListService } from './chat/user-list/services/user-list.service';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './authentication/components/login/login.component';
import { RegistrationComponent } from './authentication/components/registration/registration.component';
import { AuthGuard } from './_guards/auth.guard';
import { MastheadComponent } from './masthead/masthead.component';
import { AppRoutingModule } from './app-routing.module';
import { UserListComponent } from './chat/user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    RegistrationComponent,
    MastheadComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
    ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
