import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';
import {User} from "../_models/user";
import * as io from 'socket.io-client';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {
  message: string;  
  messages: string[] = [];
  online_user = 0;

  constructor(private chatService: ChatService) { }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.chatService.sendLoginMessage();
    
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });

    this.chatService
      .getUser()
      .subscribe((users: number) => {
        this.online_user = users;
    })
  }
}
