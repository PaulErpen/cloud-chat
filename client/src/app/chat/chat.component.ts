import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';
import  *  as $ from 'jquery';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {
  message: string;  
  messages: string[] = [];
  files: FileList;
  uploader: FileUploader = new FileUploader({ url: "http://localhost:3000/upload",
  itemAlias: 'photo',
  removeAfterUpload: true, 
  autoUpload: false });

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

  ngOnInit() {
    this.chatService.sendLoginMessage();
    
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
  }

  onFileChange(event) { 
    if(event.target.files && event.target.files.length) {
      this.files = event.target.files;
    }
  }
}
