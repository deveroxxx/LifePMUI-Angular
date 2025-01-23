import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-editable-input',
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.css'],
  imports: [
    MatButton,
    NgIf,
    MatFormField,
    MatInput,
    FormsModule,
    MatIconButton,
    MatIcon,
    MatLabel
  ]
})
export class EditableInputComponent implements AfterViewChecked{
  @Input() placeholder: string = 'Enter value'; // Placeholder for the input
  @Input() buttonLabel: string = 'Add'; // Label for the button
  @Input() initialValue: string = ''; // Initial value of the input
  @Input() allowEmpty: boolean = false; // Allow empty input or not

  @Output() confirm = new EventEmitter<string>(); // Event emitted on confirmation
  @Output() cancel = new EventEmitter<void>(); // Event emitted on cancellation

  @ViewChild('addElementInputField') inputField!: ElementRef<HTMLInputElement>;

  isEditing: boolean = false; // Toggles between button and input field
  value: string = ''; // Current value of the input
  private focusPending: boolean = false;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  // Listen for clicks on the document
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (this.isEditing && !this.elementRef.nativeElement.contains(event.target)) {
      this.cancelInput();
    }
  }

  startEditing(): void {
    this.isEditing = true;
    this.value = this.initialValue;
    this.focusPending = true;
  }

  confirmInput(): void {
    if (this.allowEmpty || this.value.trim()) {
      this.confirm.emit(this.value.trim());
      this.isEditing = false;
      this.value = '';
    }
  }

  // Called when the user cancels the input
  cancelInput(): void {
    this.isEditing = false;
    this.value = '';
    this.cancel.emit();
  }

  ngAfterViewChecked(): void {
    if (this.isEditing && this.focusPending) {
      setTimeout(() => { // To avoid changes during/after change detection
        this.inputField?.nativeElement?.focus();
      });
      this.focusPending = false;
    }
  }
}
