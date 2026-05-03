import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  getMenu() {
    return [
      { name: 'Attività', icon: 'fa-solid fa-calendar-check', route: '/dashboard' },
      { name: 'Aziende', icon: 'fa-solid fa-users', route: '/clients' },
      { name: 'Contatti', icon: 'fa-solid fa-address-book', route: '/contacts' },
      { name: 'Preventivi', icon: 'fa-solid fa-file-invoice', route: '/quotes' },
      { name: 'Fatture', icon: 'fa-solid fa-receipt', route: '/invoices' },
      { name: 'Opportunità', icon: 'fa-solid fa-euro-sign', route: '/opportunities' },
      { name: 'Documenti', icon: 'fa-solid fa-file-alt', route: '/documents' }
    ];
  }
}