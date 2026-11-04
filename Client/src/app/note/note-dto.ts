export interface NoteDto {
  id: string,
  title: string,
  text: string,
  updatedAt: Date
}

export interface CreateNoteDto {
  text: string,
  title: string
}

export interface UpdateNoteDto {
  text: string,
  title: string
}
