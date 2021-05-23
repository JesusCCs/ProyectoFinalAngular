import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-gimnasio-home',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss']
})
export class MisDatosComponent implements OnInit {

  page = 'mis-datos';
  type = 'gimnasio';

  constructor() {
  }

  ngOnInit(): void {
  }

}
