import { AIKnowledgeBaseDetailsState } from './pages/ai-knowledge-base-details/ai-knowledge-base-details.state'
import { AIKnowledgeBaseSearchState } from './pages/ai-knowledge-base-search/ai-knowledge-base-search.state'
export interface AIKnowledgeBaseState {
  details: AIKnowledgeBaseDetailsState
  search: AIKnowledgeBaseSearchState
}
