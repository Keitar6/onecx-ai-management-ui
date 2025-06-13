import { AIKnowledgeBase } from '../../../shared/generated'

export interface AIKnowledgeBaseDetailsViewModel {
  details: AIKnowledgeBase | undefined
  detailsLoadingIndicator: boolean
  backNavigationPossible: boolean
  detailsLoaded: boolean
  editMode: boolean
  isSubmitting: boolean
}
