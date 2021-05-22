import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-gimnasio-home',
  templateUrl: './gimnasio-home.component.html',
  styleUrls: ['./gimnasio-home.component.scss']
})
export class MisDatosComponent implements OnInit {

  page = 'mis-datos';
  type = 'gimnasio';

  constructor() {
  }

  ngOnInit(): void {
  }

}
