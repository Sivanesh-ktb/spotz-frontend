import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-priority-boxes',
  templateUrl: './priority-boxes.html',
  styleUrls: ['./priority-boxes.css'],
})
export class PriorityBoxesComponent {
  @Input() viewMode?: string;
  @Input() priority!: number;
}
