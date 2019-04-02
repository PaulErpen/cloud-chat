import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';
import  *  as $ from 'jquery';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {
  message: string;  
  messages: string[] = [];
  files: FileList;

  constructor(private chatService: ChatService) { }

  sendMessage() {
    if(this.files != undefined) {
      this.chatService.sendFiles(this.files);
      this.files = undefined;
      $('#uploadfiles').val("");
    }
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  onFileChange(event) { 
    if(event.target.files && event.target.files.length) {
      this.files = event.target.files;
    }
  }

  ngOnInit() {
    this.chatService.sendLoginMessage();
    
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
  }
}
