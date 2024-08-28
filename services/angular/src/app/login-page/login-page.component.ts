import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { EventsService } from '../services/event.service';

@Component({
  selector: 'app-login',
  styleUrls: ['./login-page.component.css'],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  loginForm: FormGroup = new FormGroup({
    signum: new FormControl(null,[Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  public loginError = false;

  constructor(
    private authService: AuthService,
    private eventService: EventsService,
    private router: Router,
  ) { }

  public async login(): Promise<void> {
    this.loginForm.value.signum = this.loginForm.value.signum.trim();
    this.authService.validate(JSON.stringify(this.loginForm.value)).then((response: { [key: string]: any }) => {
      if (response.success){
        this.authService.setCookie(response);
        this.eventService.sendMessage('loggedIn');
        this.router.navigate(['']);
      } else if (!response.success) {
        this.loginError = true;
      }
    });
  }
};
