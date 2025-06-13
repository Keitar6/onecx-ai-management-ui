import {
  DataTableColumn,
  DiagramComponentState,
  InteractiveDataViewComponentState,
  RowListGridData,
  SearchHeaderComponentState
} from '@onecx/portal-integration-angular'
import { AIKnowledgeBaseSearchCriteria } from './ai-knowledge-base-search.parameters'

export interface AIKnowledgeBaseSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: AIKnowledgeBaseSearchCriteria
  results: RowListGridData[]
  resultComponentState: InteractiveDataViewComponentState | null
  searchHeaderComponentState: SearchHeaderComponentState | null
  diagramComponentState: DiagramComponentState | null
  chartVisible: boolean
  searchLoadingIndicator: boolean
  searchExecuted: boolean
}
