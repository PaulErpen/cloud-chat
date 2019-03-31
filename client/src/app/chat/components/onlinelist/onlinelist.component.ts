import { Component, OnInit } from '@angular/core';
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-onlinelist',
  templateUrl: './onlinelist.component.html',
  styleUrls: ['./onlinelist.component.less']
})
export class OnlinelistComponent implements OnInit {
  online_user: string[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService
      .getUser()
      .subscribe((users: string[]) => {
        this.online_user = users;
      });
  }

}
