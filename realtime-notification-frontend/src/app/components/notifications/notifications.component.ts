import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  private welcomeSub!: Subscription;
  private notificationSub!: Subscription;

  constructor(private socketService: WebSocketService) {}

  ngOnInit(): void {
    // Emit "hello" to the server once component is loaded
    this.socketService.emit('hello', 'Hello from Angular!');

    // Listen for "welcome" event from the server
    this.welcomeSub = this.socketService
      .listen<string>('welcome')
      .subscribe((message) => {
        this.messages.push(message);
      });

    // ✅ Listen for real notifications triggered from the backend
    this.notificationSub = this.socketService
      .listen<string>('notification')
      .subscribe((message) => {
        console.log('Received notification from server: ', message); // ✅ Log here

        this.messages.push(message);
      });
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  ngOnDestroy(): void {
    // Cleanup the subscription when component is destroyed
    if (this.welcomeSub) {
      this.welcomeSub.unsubscribe();
    }
    if (this.notificationSub) this.notificationSub.unsubscribe();
  }
}
