import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SioClientTestService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.sioEndpoint, environment.sioOptions); // Adjust the URL to your server
  }

  public sendMessage(triggerEvent:string,pushEnvelope: any): Observable<boolean> {
    console.log('SioClientTestService::sendMessage()/:triggerEvent:', triggerEvent)
    console.log('SioClientTestService::sendMessage()/:payLoadStr:', pushEnvelope)
    const msg = JSON.stringify(pushEnvelope);
    return new Observable((observer) => {
      this.socket.emit(triggerEvent, msg, (response: { status: boolean }) => {
        if (response.status) {
          console.log('SioClientTestService::sendMessage()/:response.status:', response.status)
          observer.next(true);
        } else {
          observer.error('Message delivery failed');
        }
        observer.complete();
      });
    });
  }

  sendMessage2(triggerEvent:string,pushEnvelope: any): Observable<boolean> {
    console.log('SioClientTestService::sendMessage2()/:triggerEvent:', triggerEvent)
    console.log('SioClientTestService::sendMessage2()/:payLoadStr:', pushEnvelope)
    const msg = JSON.stringify(pushEnvelope);
    this.socket.emit(triggerEvent, msg);
    return new Observable<boolean>(observer => {
      this.socket.on('messageSent', (data: boolean) => {
        observer.next(data);
        observer.complete();
      });
      this.socket.on('error', (error: any) => {
        observer.error(error);
      });
    });
  }

  public listen(emittEvent: string): Observable<string> {
    return new Observable((observer) => {
      this.socket.on(emittEvent, (data: string) => {
        observer.next(data);
      });
    });
  }
}