import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Routes, Route, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
import { RegistrationComponent } from './registration/registration.component';
import { ChatComponent } from './chat/chat.component';

const routes : Routes = [
  {path: '', component:ChatComponent},
  {path: 'registration', component:RegistrationComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
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