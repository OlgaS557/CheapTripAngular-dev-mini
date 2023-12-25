import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class LandingComponent implements OnInit {
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    let el = document.getElementById('secondScreen').getBoundingClientRect();
    if (el.top < 650) {
      this.isDark = true;
    } else {
      this.isDark = false;
    }
  }

  isDark: boolean;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isDark = false;
    let el = document.getElementById('secondScreen');
  }

  toSearchPage() {
    this.router.navigate(['/search']);
  }
}
