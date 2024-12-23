import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
  styleUrls: ['./tag.css']
})
export class TagsComponent {
  showTags = false;
  @Input() tags!:string[];
  canImportTags = true;
  @Output() tagsValue = new EventEmitter<string[]>();

  editTags() {
    this.showTags = !this.showTags;
  }

  addTag() {
    this.tags.push('');
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  importTags() {
    this.tagsValue.emit(this.tags);
  }

  saveTags() {
    this.showTags = false;
    this.tagsValue.emit(this.tags)
  }

  cancelTags() {
    this.showTags = false;
  }

  onSubmit() {
    this.saveTags();
  }

  trackByIndex(index: number): number {
    return index;
  }
}
