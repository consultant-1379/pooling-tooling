import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoolsService } from '../services/pools.service';
import { AuthService } from '../services/auth.service';
import { SocketioService } from '../services/socketio.service';
import { EventsService } from '../services/event.service';
import { environment } from '../../environments/environment';
import { setAdditionalText } from '../utils/set-environment-additional-text';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  @Input() username = '';
  @Input() poolsNames = Array();

  public version = environment.version;
  public isAuthenticated = false;
  public ioConnection: any;
  public environmentModeText = '';

  constructor(private poolsService: PoolsService,
    private socketService: SocketioService,
    private authService: AuthService,
    private router: Router,
    private eventService: EventsService,
    ) {
  }

  @HostListener('window:focus') onFocus(): void {
    if (!this.authService.isAuthenticated() && this.router.url !== '/login') {
      this.username = '';
      this.isAuthenticated = false;
      this.router.navigate(['login']);
    }

    if (this.authService.isAuthenticated() && this.router.url === '/login') {
      this.username = this.authService.getCookie('signum');
      this.isAuthenticated = true;
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.checkForUser();
    this.getAllPools();
    this.listenForEvents();
    this.eventService.getMessage().subscribe((response) => {
      if (response === 'loggedIn') {
        this.username = this.authService.getCookie('signum');
        this.isAuthenticated = true;
      }
    });

    this.environmentModeText = setAdditionalText(environment.production);
  }

  public logOut(): void {
    this.authService.logout();
    this.username = '';
    this.isAuthenticated = false;
    this.router.navigate(['login']);
  }

  private getAllPools(): any {
    this.poolsNames = [];
    this.poolsService.getPools().subscribe((pools: any[]) => {
      pools.forEach((pool: { poolName: any }) => {
        this.poolsNames.push(pool.poolName);
      });
      return this.poolsNames;
    });
  }

  private checkForUser(): void {
    if (this.authService.getCookie('user')) {
      this.username = this.authService.getCookie('signum');
      this.isAuthenticated = true;
    };
  }

  private listenForEvents(): void {
    this.ioConnection = this.socketService
      .onPoolMessage()
      .subscribe((message: string) => {
        if (message.includes('pools table updated')) {
          this.getAllPools();
        }
      });
  }
}
