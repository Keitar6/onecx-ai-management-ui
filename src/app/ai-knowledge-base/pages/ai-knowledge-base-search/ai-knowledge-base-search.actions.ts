import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
  DataTableColumn,
  GroupByCountDiagramComponentState,
  InteractiveDataViewComponentState,
  SearchHeaderComponentState
} from '@onecx/portal-integration-angular'
import { AIKnowledgeBase } from '../../../shared/generated'
import { AIKnowledgeBaseSearchCriteria } from './ai-knowledge-base-search.parameters'

export const AIKnowledgeBaseSearchActions = createActionGroup({
  source: 'AIKnowledgeBaseSearch',
  events: {
    'Details button clicked': props<{
      id: number | string
    }>(),
    'Create button clicked': emptyProps(),
    'Create AIKnowledge base cancelled': emptyProps(),
    'Create AIKnowledge base succeeded': emptyProps(),
    'Create AIKnowledge base failed': props<{
      error: string | null
    }>(),
    'Edit button clicked': props<{
      id: number | string
    }>(),
    'Edit AIKnowledge base cancelled': emptyProps(),
    'Edit AIKnowledge base succeeded': emptyProps(),
    'Edit AIKnowledge base failed': props<{
      error: string | null
    }>(),
    'Delete button clicked': props<{
      id: number | string
    }>(),
    'Delete AIKnowledge base cancelled': emptyProps(),
    'Delete AIKnowledge base succeeded': emptyProps(),
    'Delete AIKnowledge base failed': props<{
      error: string | null
    }>(),
    'Search button clicked': props<{
      searchCriteria: AIKnowledgeBaseSearchCriteria
    }>(),
    'Reset button clicked': emptyProps(),
    'AIKnowledgeBase search results received': props<{
      stream: AIKnowledgeBase[]
      size: number
      number: number
      totalElements: number
      totalPages: number
    }>(),
    'AIKnowledgeBase search results loading failed': props<{ error: string | null }>(),
    'Export button clicked': emptyProps(),
    'Result component state changed': props<InteractiveDataViewComponentState>(),
    'Search header component state changed': props<SearchHeaderComponentState>(),
    'Diagram component state changed': props<GroupByCountDiagramComponentState>(),
    'Chart visibility toggled': emptyProps(),
    'Displayed columns changed': props<{
      displayedColumns: DataTableColumn[]
    }>()
  }
})
