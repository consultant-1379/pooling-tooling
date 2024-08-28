import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable()
export class SocketioService {

  socket!: Socket;

  constructor() { }

  public connect(): void {
    let host = '/';
    if (isDevMode() && environment.sandbox === false) {
      host = environment.socketHost ?? 'localhost/';
    }
    this.socket = io(host, {
      path: '/api/socket.io',
      rejectUnauthorized: false,
      secure: true,
    });
  }

  public onTestEnvironmentMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('testEnvironmentUpdate', (data: any) => {
        observer.next(data);
      });
    });
  }

  public onPoolMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('poolUpdate', (data: any) => {
        observer.next(data);
      });
    });
  }

  public onScheduleMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('scheduleUpdate', (data: any) => {
        observer.next(data);
      });
    });
  }
}
