import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {

  @Output() toggle = new EventEmitter<boolean>();

  menu: any[] = [];
  isOpen = false;

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menu = this.menuService.getMenu();
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;

    this.toggle.emit(this.isOpen);
  }
}