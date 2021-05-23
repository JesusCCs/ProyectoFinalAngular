import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() type!: string;
  @Input() page!: string;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.auth.logout();
  }
}
