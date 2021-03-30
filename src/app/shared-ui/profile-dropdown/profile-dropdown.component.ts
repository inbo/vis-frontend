import {Component, ElementRef, HostListener} from '@angular/core';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html'
})
export class ProfileDropdownComponent {
  isOpen = false;

  constructor(private authService: AuthService, private eRef: ElementRef) {
  }

  public get fullName() {
    return this.authService.fullName;
  }

  public get username() {
    return this.authService.username;
  }

  public get picture() {
    return this.authService.picture;
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.isOpen = false;
    }
  }
}
