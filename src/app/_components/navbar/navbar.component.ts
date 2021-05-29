import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  @Input() type!: string;
  @Input() page!: string;

  @Output() nuevoAnuncio = new EventEmitter<boolean>();

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.auth.logout();
  }

  crearAnuncio(): void {
    this.nuevoAnuncio.emit(true);
  }
}
