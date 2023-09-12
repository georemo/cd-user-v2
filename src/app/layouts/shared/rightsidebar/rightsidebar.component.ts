import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss']
})
export class RightsidebarComponent implements OnInit {
  isLightModeOn: boolean = true; // Light Mode is enabled by default
  isDarkModeOn: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  /**
   * Hide the sidebar
   */
  public hide() {
    document.body.classList.remove('right-bar-enabled');
  }

  onLightModeChange(): void {
    // When the light mode switch changes, disable the dark mode switch
    this.isDarkModeOn = false;
    document.body.setAttribute('data-bs-theme','light')
  }

  onDarkModeChange(): void {
    // When the dark mode switch changes, disable the light mode switch
    this.isLightModeOn = false;
    document.body.setAttribute('data-bs-theme','dark')
  }
}
