import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  cards: string[] = new Array(10).fill(0).map((_, i) => `Card ${++i}`);

  constructor() {
  }

  ngOnInit() {
  }

}
