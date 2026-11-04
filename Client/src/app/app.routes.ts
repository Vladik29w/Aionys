import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notes' },
  {
    path: 'notes',
    loadComponent: () => import('./note/components/note-page/note-page').then((m) => m.NotePage),
  },
  {
    path: 'notes/new',
    loadComponent: () => import('./note/components/note-editor/note-editor').then((m) => m.NoteEditor),
  },
  {
    path: 'notes/:id',
    loadComponent: () => import('./note/components/note-editor/note-editor').then((m) => m.NoteEditor),
  },
];
