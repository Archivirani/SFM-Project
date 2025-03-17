import { Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: false,
  styleUrls: [],
})
export class SidebarComponent implements OnInit {
  constructor(private scriptLoader: ScriptLoaderService) {}

  ngOnInit(): void {
    this.scriptLoader
      .loadScript('assets/js/app.js')
      .then(() => {})
      .catch((error) => console.error(error));
  }
}
