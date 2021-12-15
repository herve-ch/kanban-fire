import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Task } from './task/task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'kanban-fire Jeux';

  constructor(private authService: AuthService) { }
  
  onSignOut() {
    this.authService.signOutUser();
  }
}
  