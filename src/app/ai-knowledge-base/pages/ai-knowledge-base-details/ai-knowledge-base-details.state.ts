import { AIKnowledgeBase } from '../../../shared/generated'

export interface AIKnowledgeBaseDetailsState {
  details: AIKnowledgeBase | undefined
  detailsLoadingIndicator: boolean
  detailsLoaded: boolean
  editMode: boolean
  isSubmitting: boolean
}
