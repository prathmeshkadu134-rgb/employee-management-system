import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Employee } from './employee/employee';

@Component({
  selector: 'app-root',
  imports: [RouterLink,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Employee-Management-System');
}
