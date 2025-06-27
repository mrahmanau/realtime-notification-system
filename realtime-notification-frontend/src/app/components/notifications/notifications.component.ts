import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

// ✅ Define the shape of a notification
interface NotificationItem {
  message: string;
  timestamp: string; // ✅ Lowercase to match what backend sends
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  messages: NotificationItem[] = [];
  unreadCount = 0;

  // Subscriptions to manage WebSocket listeners
  private welcomeSub!: Subscription;
  private notificationSub!: Subscription;

  // Audio instance to play notification sound
  private audio = new Audio();

  constructor(private socketService: WebSocketService) {}

  ngOnInit(): void {
    // Load the notification sound
    this.audio.src = 'assets/sounds/notification.mp3';
    this.audio.load();

    // Optional: Emit a hello message when the component loads
    this.socketService.emit('hello', 'Hello from Angular!');

    // ✅ Subscribe to "welcome" message from backend (string only)
    this.welcomeSub = this.socketService
      .listen<string>('welcome')
      .subscribe((message) => {
        // Push the welcome message as a NotificationItem (fake timestamp)
        this.messages.push({
          message,
          timestamp: new Date().toISOString(),
        });
      });

    // ✅ Subscribe to real-time "notification" events from backend
    this.notificationSub = this.socketService
      .listen<NotificationItem>('notification')
      .subscribe((data) => {
        this.messages.push(data); // `data` is { message, timestamp }
        this.unreadCount++;
        this.playSound(); // 🔊 Play audio
      });

    this.requestBrowserPermission(); // Ask for notification permission
  }

  // Play notification sound
  playSound(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.play().catch((e) => {
      console.warn('Sound play blocked by browser:', e);
    });
  }

  // Request browser notification permission
  requestBrowserPermission(): void {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((perm) => {
        console.log('Notification permission:', perm);
      });
    }
  }

  // Format ISO timestamp for UI display
  formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  markAllAsRead(): void {
    this.unreadCount = 0;
  }

  // Clean up subscriptions
  ngOnDestroy(): void {
    this.welcomeSub?.unsubscribe();
    this.notificationSub?.unsubscribe();
  }
}
