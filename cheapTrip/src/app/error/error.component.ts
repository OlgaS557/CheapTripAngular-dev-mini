import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessage } from './alertMessage.model';

@Component({

  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertMessage) {}

 currentClass: Object;

  ngOnInit(): void {
   this.currentClass = {
     error: this.data.type=="error",
     warning: this.data.type=="warning"}
  }

}
