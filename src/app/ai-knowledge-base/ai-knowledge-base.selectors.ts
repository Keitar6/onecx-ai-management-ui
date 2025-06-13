import { createFeatureSelector } from '@ngrx/store'
import { AIKnowledgeBaseFeature } from './ai-knowledge-base.reducers'
import { AIKnowledgeBaseState } from './ai-knowledge-base.state'

export const selectAIKnowledgeBaseFeature = createFeatureSelector<AIKnowledgeBaseState>(AIKnowledgeBaseFeature.name)
