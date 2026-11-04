import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { catchError, firstValueFrom, Observable, of, tap } from 'rxjs';
import { NoteService } from './note-service';
import { CreateNoteDto, NoteDto, UpdateNoteDto } from './note-dto';

export interface NoteState {
  isLoadingList: boolean;
  isLoadingNote: boolean;
  pendingAction: 'save' | 'delete' | null;
  listError: string | null;
  editorError: string | null;
}

const initialState: NoteState = {
  isLoadingList: false,
  isLoadingNote: false,
  pendingAction: null,
  listError: null,
  editorError: null,
};

export const NoteStore = signalStore(
  { providedIn: 'root' },
  withEntities<NoteDto>(),
  withState(initialState),
  withComputed(({ isLoadingNote, pendingAction }) => ({
    isEditorBusy: computed(() => isLoadingNote() || pendingAction() !== null),
  })),
  withMethods((store, noteService = inject(NoteService)) => {
    let listRequestId = 0;
    let editorRequestId = 0;
    let collectionVersion = 0;

    return {
      resetEditorState(): void {
        editorRequestId++;
        patchState(store, { isLoadingNote: false, editorError: null });
      },

      async loadAll(): Promise<void> {
        const requestId = ++listRequestId;
        patchState(store, { isLoadingList: true, listError: null });

        try {
          while (requestId === listRequestId) {
            const version = collectionVersion;
            const notes = await firstValueFrom(noteService.getAll());
            if (requestId !== listRequestId) return;
            if (version !== collectionVersion) continue;

            patchState(store, setAllEntities(notes), { isLoadingList: false });
            return;
          }
        } catch {
          if (requestId !== listRequestId) return;

          patchState(store, {
            isLoadingList: false,
            listError: 'notes.errors.loadList',
          });
        }
      },

      loadById(id: string): Observable<NoteDto | null> {
        const requestId = ++editorRequestId;
        patchState(store, { isLoadingNote: true, editorError: null });

        return noteService.getById(id).pipe(
          tap((note) => {
            collectionVersion++;
            patchState(store, setEntity(note), { isLoadingNote: false });
          }),
          catchError(() => {
            if (requestId === editorRequestId) {
              patchState(store, {
                isLoadingNote: false,
                editorError: 'notes.errors.loadNote',
              });
            }
            return of(null);
          }),
        );
      },

      async create(dto: CreateNoteDto): Promise<NoteDto | null> {
        if (store.isEditorBusy()) return null;

        const requestId = editorRequestId;
        patchState(store, { pendingAction: 'save', editorError: null });

        try {
          const note = await firstValueFrom(noteService.create(dto));
          collectionVersion++;
          patchState(store, setEntity(note));
          return note;
        } catch {
          if (requestId === editorRequestId) {
            patchState(store, { editorError: 'notes.errors.saveNote' });
          }
          return null;
        } finally {
          patchState(store, { pendingAction: null });
        }
      },

      async update(id: string, dto: UpdateNoteDto): Promise<boolean> {
        if (store.isEditorBusy()) return false;

        const requestId = editorRequestId;
        patchState(store, { pendingAction: 'save', editorError: null });

        try {
          await firstValueFrom(noteService.update(id, dto));
          collectionVersion++;
          patchState(store, updateEntity({ id, changes: dto }));
          return true;
        } catch {
          if (requestId === editorRequestId) {
            patchState(store, { editorError: 'notes.errors.saveNote' });
          }
          return false;
        } finally {
          patchState(store, { pendingAction: null });
        }
      },

      async delete(id: string): Promise<boolean> {
        if (store.isEditorBusy()) return false;

        const requestId = editorRequestId;
        patchState(store, { pendingAction: 'delete', editorError: null });

        try {
          await firstValueFrom(noteService.delete(id));
          collectionVersion++;
          patchState(store, removeEntity(id));
          return true;
        } catch {
          if (requestId === editorRequestId) {
            patchState(store, { editorError: 'notes.errors.deleteNote' });
          }
          return false;
        } finally {
          patchState(store, { pendingAction: null });
        }
      },
    };
  }),
);
