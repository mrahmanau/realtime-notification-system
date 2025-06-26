import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: Socket;

  constructor() {
    // Initialize the socket connection
    this.connect();
  }

  private connect(): void {
    // Connect to the backend server
    this.socket = io('http://localhost:4000', {
      transports: ['websocket'],
    });

    // Log connection
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server. Socket ID:', this.socket.id);
    });

    // Log disconnection
    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  // Emit a custom event to the server
  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Listen for an event from the server
  public listen<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: T) => {
        subscriber.next(data);
      });
    });
  }

  // Disconnect the socket manually (if needed)
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
