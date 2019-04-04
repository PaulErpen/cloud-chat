import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';
import  *  as $ from 'jquery';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';

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

  constructor(private chatService: ChatService, private http: HttpClient) { }

  sendMessage() {
    let inputEl: HTMLInputElement = $('#photo')[0];
    let fileCount: number = inputEl.files.length;
    if (fileCount > 0) { // a file was selected
      this.upload(inputEl);
    } else {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }

  ngOnInit() {
    this.chatService.sendLoginMessage();
    
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });

      this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
           console.log("ImageUpload:uploaded:", item, status, response);
       };
  }

  onFileChange(event) { 
    if(event.target.files && event.target.files.length) {
      this.files = event.target.files;
    }
  }

  upload(inputEl) {
    let formData = new FormData();
    formData.append('message', this.message);
    formData.append('photo', inputEl.files.item(0));
    $('#photo')[0].value = "";
    this.chatService.sendFile(formData);
  }
}
