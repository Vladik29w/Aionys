import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { of, switchMap } from 'rxjs';
import { LanguageSwitcher } from '../../../i18n/language-switcher';
import { NoteStore } from '../../note-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LanguageSwitcher,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    RouterLink,
    TranslatePipe,
  ],
  selector: 'app-note-editor',
  styleUrl: './note-editor.css',
  templateUrl: './note-editor.html',
})
export class NoteEditor {
  //inject
  protected readonly store = inject(NoteStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  //validation
  protected readonly titleMaxLength = 32;
  protected readonly textMaxLength = 10000;
  //signals
  protected readonly noteId = input<string | undefined>(undefined, { alias: 'id' });
  protected readonly isFormReady = signal(false);
  protected readonly isConfirmingDelete = signal(false);

  protected readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(this.titleMaxLength),
      ],
    }),
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(this.textMaxLength)],
    }),
  });

  constructor() {
    effect(() => {
      if (!this.isFormReady() || this.store.isEditorBusy()) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });

    toObservable(this.noteId)
      .pipe(
        switchMap((id) => {
          this.isFormReady.set(false);
          this.isConfirmingDelete.set(false);
          this.store.resetEditorState();

          return id ? this.store.loadById(id) : of(null);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((note) => {
        if (this.noteId() && !note) {
          return;
        }

        this.form.reset({ title: note?.title ?? '', text: note?.text ?? '' });
        this.isFormReady.set(true);
      });

    this.destroyRef.onDestroy(() => this.store.resetEditorState());
  }

  protected async save(): Promise<void> {
    if (this.store.isEditorBusy() || !this.isFormReady()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.noteId();
    const values = this.form.getRawValue();
    const dto = { title: values.title.trim(), text: values.text };

    const saved = id
      ? await this.store.update(id, dto)
      : (await this.store.create(dto)) !== null;

    if (saved && !this.destroyRef.destroyed && this.noteId() === id) {
      await this.router.navigate(['/notes']);
    }
  }

  protected startDelete(): void {
    this.isConfirmingDelete.set(true);
  }

  protected cancelDelete(): void {
    this.isConfirmingDelete.set(false);
  }

  protected async deleteNote(): Promise<void> {
    const id = this.noteId();
    if (!id || this.store.isEditorBusy() || !this.isFormReady()) return;

    const deleted = await this.store.delete(id);

    if (deleted && !this.destroyRef.destroyed && this.noteId() === id) {
      await this.router.navigate(['/notes']);
    }
  }
}
