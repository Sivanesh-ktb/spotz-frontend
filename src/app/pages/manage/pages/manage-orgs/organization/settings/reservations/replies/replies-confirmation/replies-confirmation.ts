import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-replies-confirmation',
  templateUrl: './replies-confirmation.html',
  styleUrls: ['./replies-confirmation.css']
})
export class RepliesConfirmationComponent {
  @Input() tabName = '';
  @Output() confirmRemove = new EventEmitter<void>();

  onConfirm() {
    this.confirmRemove.emit(); 
  }
}
