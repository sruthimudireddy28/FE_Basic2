import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hotels } from './HotelComponents/hotels/hotels';
import { Navigation } from './navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navigation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Project1');
}
