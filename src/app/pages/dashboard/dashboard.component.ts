import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Dashboard Component
 */
export class DashboardComponent implements OnInit {

 
  constructor() {
  }

  // bread crumb items
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Nazox' }, { label: 'Dashboard', active: true }];
  }
}
