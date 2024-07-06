import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  @Input() display: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() icon : string = '';

  constructor(private sanitizer: DomSanitizer) { }

  showDialog(title: string, message: string, icon: string): void {
    this.title = title;
    this.message = message;
    this.display = true;
    this.icon = icon
  }

  hideDialog(): void {
    this.display = false;
  }
}
