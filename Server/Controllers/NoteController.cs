using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("notes")]
    public class NoteController(INoteService noteService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<NoteDto>>> GetAll(CancellationToken ct)
        {
            var notes = await noteService.GetAllNotesAsync(ct);
            return Ok(notes);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<NoteDto>> GetById(Guid id, CancellationToken ct)
        {
            var note = await noteService.GetNoteByIdAsync(id, ct);
            if (note is null)
                return NotFound();  

            return Ok(note);
        }

        [HttpPost]
        public async Task<ActionResult<NoteDto>> Create([FromBody] CreateNoteDto noteDto, CancellationToken ct)
        {
            var createdNote = await noteService.CreateNoteAsync(noteDto, ct);
            return CreatedAtAction(nameof(GetById), new { id = createdNote.Id }, createdNote);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateNoteDto noteDto, CancellationToken ct)
        {
            var updated = await noteService.UpdateNoteAsync(id, noteDto, ct);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            var deleted = await noteService.DeleteNoteAsync(id, ct);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
