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
  }

  ngOnDestroy(): void {
    // Cleanup the subscription when component is destroyed
    if (this.welcomeSub) {
      this.welcomeSub.unsubscribe();
    }
  }
}
