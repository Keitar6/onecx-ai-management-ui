import { combineReducers, createFeature } from '@ngrx/store'
import { AIKnowledgeBaseState } from './ai-knowledge-base.state'
import { AIKnowledgeBaseDetailsReducer } from './pages/ai-knowledge-base-details/ai-knowledge-base-details.reducers'
import { AIKnowledgeBaseSearchReducer } from './pages/ai-knowledge-base-search/ai-knowledge-base-search.reducers'

export const AIKnowledgeBaseFeature = createFeature({
  name: 'AIKnowledgeBase',
  reducer: combineReducers<AIKnowledgeBaseState>({
    details: AIKnowledgeBaseDetailsReducer,
    search: AIKnowledgeBaseSearchReducer
  })
})
