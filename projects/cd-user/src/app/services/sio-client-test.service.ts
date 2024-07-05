import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';
import { environment } from 'projects/cd-user/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SioClientTestService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.sioEndpoint, environment.sioOptions); // Adjust the URL to your server
  }

  // public sendMessage(triggerEvent:string,pushEnvelope: any): Observable<boolean> {
  //   const msg = JSON.stringify(pushEnvelope);
  //   return new Observable((observer) => {
  //     this.socket.emit(triggerEvent, msg, (response: { status: boolean }) => {
  //       if (response.status) {
  //         observer.next(true);
  //       } else {
  //         observer.error('Message delivery failed');
  //       }
  //       observer.complete();
  //     });
  //   });
  // }

  sendMessage(triggerEvent: string, pushEnvelope: any): Observable<boolean> {
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

  // public listen1(emittEvent: string): Observable<string> {
  //   return new Observable((observer) => {
  //     this.socket.on(emittEvent, (data: string) => {
  //       observer.next(data);
  //     });
  //   });
  // }

  sioListen(emittEvent: string): Observable<any> {
    return fromEvent(this.socket, emittEvent);
  }

  onUserJoined(): Observable<any> {
    return fromEvent(this.socket, 'userJoined');
  }

  onUserLeft(): Observable<any> {
    return fromEvent(this.socket, 'userLeft');
  }

  onCustomEvent(eventName: string): Observable<any> {
    return fromEvent(this.socket, eventName);
  }
}