import { Component, OnInit } from '@angular/core';
import '../assets/css/systemBar.css';
import '../assets/css/styles.css';
import { SocketioService } from './services/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'RPT';
  ioConnection: any;

  constructor(
    private socketService: SocketioService,
  ) { }

  ngOnInit(): void {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.connect();
  }
}
