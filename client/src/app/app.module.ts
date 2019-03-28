import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Routes, Route, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ChatService } from './chat/services/chat.service';
import { ChatComponent } from './chat/chat.component';
import { AuthenticationComponent } from './authentication/authentication.component';

const routes : Routes = [
  {path: '', component:ChatComponent},
  {path: 'auth', component:AuthenticationComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
    ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
