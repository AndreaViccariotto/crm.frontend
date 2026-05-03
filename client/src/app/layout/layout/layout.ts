import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, RouterOutlet],
  standalone: true,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})

export class LayoutComponent {
isSidebarOpen = false;

onSidebarToggle(state: boolean) {
  this.isSidebarOpen = state;
}
}
