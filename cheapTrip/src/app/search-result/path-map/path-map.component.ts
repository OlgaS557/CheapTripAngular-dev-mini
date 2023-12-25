import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-path-map',
  templateUrl: './path-map.component.html',
  styleUrls: ['./path-map.component.scss'],
})
export class PathMapComponent {

  @Input() frameWidth: number;
  @Input() frameHeight: number;
  @Input() isDeskTop: boolean;
  constructor() {
  }
}

