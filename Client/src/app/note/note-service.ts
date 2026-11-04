import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments';
import { NoteDto, CreateNoteDto, UpdateNoteDto } from './note-dto';

@Service()
export class NoteService {
  private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/notes`;

    getAll(): Observable<NoteDto[]> {
      return this.http.get<NoteDto[]>(this.apiUrl);
    }

    getById(id: string): Observable<NoteDto> {
      return this.http.get<NoteDto>(`${this.apiUrl}/${id}`);
    }

    create(dto: CreateNoteDto): Observable<NoteDto> {
      return this.http.post<NoteDto>(this.apiUrl, dto);
    }

    update(id: string, dto: UpdateNoteDto): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
