import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';
import { TodoService } from '../../service/todo.service'; // Adjust the path as needed
import { QuillModule } from 'ngx-quill';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quill-editor-wrapper',
  templateUrl: './quill-editor-wrapper.component.html',
  styleUrls: ['./quill-editor-wrapper.component.css'],
  imports: [
    FormsModule,
    QuillModule,
    MatButton,
      NgIf],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: QuillEditorWrapperComponent,
      multi: true
    }
  ]
})
export class QuillEditorWrapperComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() value: string = '';
  @Input() dataId: string = '';
  @Input() defaultPlaceHolder: string = 'Click to edit description...';
  @Output() valueChange = new EventEmitter<string>();
  @Input() onSaveAction!: (value: string) => Observable<any>;


  isEditing = false;
  sanitizedContent: SafeHtml = '';
  private quillEditor!: Quill;

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private sanitizer: DomSanitizer, private todoService: TodoService) {}

  ngOnInit(): void {
    this.sanitizeContent();
  }

  ngOnChanges(): void {
    this.sanitizeContent();
  }

  private sanitizeContent(): void {
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
      this.value || this.defaultPlaceHolder
    );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.valueChange.emit(this.value);
      this.onChange(this.value);
    }
  }

  onEditorCreated(quill: Quill): void {
    this.quillEditor = quill;
    const toolbar: any = quill.getModule('toolbar');
    if (toolbar) {
      toolbar.addHandler('image', this.imageHandler.bind(this));
    }
    // Focus and position the cursor at the end.
    setTimeout(() => {
      quill.focus();
      const length = quill.getLength();
      quill.setSelection(length, 0);
    });
  }

  imageHandler(): void {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        const range = this.quillEditor.getSelection();
        this.todoService.uploadImage(this.dataId, file).subscribe({
          next: response => {
            if (response?.url) {
              this.quillEditor.insertEmbed(range?.index || 0, 'image', response.url, 'user');
            }
          },
          error: error => console.error('Image upload failed', error)
        });
      }
    };
  }


  onClose(): void {
    this.isEditing = false;
  }

  onSave(): void {
    if (this.onSaveAction) {
      this.onSaveAction(this.value).subscribe({
      next: (b) => {
        this.valueChange.emit(this.value);
        this.onChange(this.value);
        this.sanitizeContent();
        this.isEditing = false;
      },
      error: (err) => console.error('Failed to edit description:', err),
    });
    }
  }

  // --- ControlValueAccessor implementation ---
  writeValue(value: string): void {
    this.value = value;
    this.sanitizeContent();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}