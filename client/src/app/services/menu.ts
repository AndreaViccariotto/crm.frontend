import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  getMenu() {
    return [
      {
        name: 'Attività',
        icon: 'fa-solid fa-calendar-check',
        route: '/task-list'
      },
      {
        name: 'Aziende',
        icon: 'fa-solid fa-users',
        route: '/companies'
      },
      {
        name: 'Contatti',
        icon: 'fa-solid fa-address-book',
        route: '/contacts'
      },

      {
        name: 'Impostazioni',
        icon: 'fa-solid fa-cog',
        children: [
          {
            name: 'Utenti',
            icon: 'fa-solid fa-user',
            route: '/users'
          },
          {
            name: 'Stati attività',
            icon: 'fa-solid fa-list',
            route: '/task-status'
          },
          {
            name: 'Ruoli Utente',
            icon: 'fa-solid fa-user-shield',
            route: '/user-roles'
          }
        ]
      }
    ];
  }
}