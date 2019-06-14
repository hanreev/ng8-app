import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, MatExpansionPanelDefaultOptions } from '@angular/material/expansion';
import { MatIconRegistry } from '@angular/material/icon';

import { SidenavComponent } from './sidenav';

export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  isSuperUser?: boolean;
  isActive?: boolean;
  dateJoined?: Date;
  lastLogin?: Date;
}

export class User {

  get displayName() {
    if (this.firstName || this.lastName)
      return [this.firstName, this.lastName].join(' ');

    return this.username;
  }

  constructor(
    public id: number,
    public username: string,
    public firstName?: string,
    public lastName?: string,
    public isSuperUser?: boolean,
    public isActive?: boolean,
    public dateJoined?: Date,
    public lastLogin?: Date,
  ) {
    this.isSuperUser = isSuperUser === true ? isSuperUser : false;
    this.isActive = isActive === false ? isActive : true;
  }

}

export interface NavItem {
  title: string;
  action: () => void;
  icon?: string;
  children?: NavItem[];
}

const EXPANSION_PANEL_DEFAULT_OPTIONS: MatExpansionPanelDefaultOptions = {
  expandedHeight: '40px',
  collapsedHeight: '40px',
  hideToggle: false
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: [
    { provide: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, useValue: EXPANSION_PANEL_DEFAULT_OPTIONS }
  ]
})
export class AppComponent implements OnInit {

  title = 'Angular 8 App';
  user: User;
  navItems: (NavItem | 'divider')[] = [
    {
      title: 'Home',
      action: () => { },
      icon: 'home',
      children: [
        { title: 'Menu 1', action: () => { } },
        { title: 'Menu 2', action: () => { } },
        { title: 'Menu 3', action: () => { } },
      ]
    },
    {
      title: 'Layers',
      action: () => { },
      icon: 'layers',
    },
    {
      title: 'Maps',
      action: () => { },
      icon: 'maps',
    },
    'divider',
    {
      title: 'Settings',
      action: () => { },
      icon: 'settings',
    },
  ];

  @ViewChild('sidebar', { static: true }) private _sidebar: SidenavComponent;

  constructor(
    matIconRegistry: MatIconRegistry,
  ) {
    matIconRegistry.registerFontClassAlias('outlined', 'material-icons-outlined');
  }

  ngOnInit() {
    this.login();
  }

  login() {
    this.user = new User(1, 'admin', 'Admin');
    this.user.dateJoined = new Date('2019-05-30');
    this.user.lastLogin = new Date();
  }

  logout() {
    this.user = null;
  }

}
