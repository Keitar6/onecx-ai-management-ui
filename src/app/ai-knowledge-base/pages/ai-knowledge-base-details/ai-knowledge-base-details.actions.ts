import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AIKnowledgeBase } from '../../../shared/generated'

export const AIKnowledgeBaseDetailsActions = createActionGroup({
  source: 'AIKnowledgeBaseDetails',
  events: {
    'navigated to details page': props<{
      id: string | undefined
    }>(),
    'AIKnowledge base details received': props<{
      details: AIKnowledgeBase
    }>(),
    'AIKnowledge base reloaded details received': props<{
      details: AIKnowledgeBase
    }>(),
    'AIKnowledge base details loading failed': props<{ error: string | null }>(),
    'edit mode set': props<{ editMode: boolean }>(),
    'Update AIKnowledge base cancelled': emptyProps(),
    'Update AIKnowledge base succeeded': emptyProps(),
    'Update AIKnowledge base failed': props<{
      error: string | null
    }>(),
    'Delete AIKnowledge base cancelled': emptyProps(),
    'Delete AIKnowledge base succeeded': emptyProps(),
    'Delete AIKnowledge base failed': props<{
      error: string | null
    }>(),
    'cancel edit back clicked': emptyProps(),
    'cancel edit confirm clicked': emptyProps(),
    'cancel edit not dirty': emptyProps(),
    'edit button clicked': emptyProps(),
    'save button clicked': props<{
      details: AIKnowledgeBase
    }>(),
    'cancel button clicked': props<{
      dirty: boolean
    }>(),
    'delete button clicked': emptyProps(),
    'navigate back button clicked': emptyProps(),
    'back navigation started': emptyProps(),
    'back navigation failed': emptyProps(),
    'navigation to search started': emptyProps(),
    'navigation to search not started': emptyProps()
  }
})
