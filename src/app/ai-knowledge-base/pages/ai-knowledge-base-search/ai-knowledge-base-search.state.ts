import {
  DataTableColumn,
  DiagramComponentState,
  InteractiveDataViewComponentState,
  SearchHeaderComponentState
} from '@onecx/portal-integration-angular'
import { AIKnowledgeBase } from 'src/app/shared/generated'
import { AIKnowledgeBaseSearchCriteria } from './ai-knowledge-base-search.parameters'

export interface AIKnowledgeBaseSearchState {
  columns: DataTableColumn[]
  results: AIKnowledgeBase[]
  displayedColumns: string[] | null
  chartVisible: boolean
  resultComponentState: InteractiveDataViewComponentState | null
  searchHeaderComponentState: SearchHeaderComponentState | null
  diagramComponentState: DiagramComponentState | null
  searchLoadingIndicator: boolean
  criteria: AIKnowledgeBaseSearchCriteria
  searchExecuted: boolean
}
