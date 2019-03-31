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
import { MastheadComponent } from './masthead/masthead.component';
import { AppRoutingModule } from './app-routing.module';
import { OnlinelistComponent } from './chat/components/onlinelist/onlinelist.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    RegistrationComponent,
    MastheadComponent,
    OnlinelistComponent
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
