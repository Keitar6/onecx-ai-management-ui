import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
// import { selectBackNavigationPossible } from '../../../shared/selectors/onecx.selectors'
import { AIKnowledgeBase } from '../../../shared/generated'
import { AIKnowledgeBaseFeature } from '../../ai-knowledge-base.reducers'
import { initialState } from './ai-knowledge-base-details.reducers'
import { AIKnowledgeBaseDetailsViewModel } from './ai-knowledge-base-details.viewmodel'

// Taking original from accelerator create a lot of errors,it just doesn't see some variables apparently
function selectBackNavigationPossible(state: Record<string, any>): boolean {
  console.log('state: ', state)
  // throw new Error('Function not implemented.')
  return true
}

export const AIKnowledgeBaseDetailsSelectors = createChildSelectors(AIKnowledgeBaseFeature.selectDetails, initialState)

export const selectAIKnowledgeBaseDetailsViewModel = createSelector(
  AIKnowledgeBaseDetailsSelectors.selectDetails,
  AIKnowledgeBaseDetailsSelectors.selectDetailsLoadingIndicator,
  selectBackNavigationPossible,
  AIKnowledgeBaseDetailsSelectors.selectDetailsLoaded,
  AIKnowledgeBaseDetailsSelectors.selectEditMode,
  AIKnowledgeBaseDetailsSelectors.selectIsSubmitting,
  (
    details: AIKnowledgeBase | undefined,
    detailsLoadingIndicator: boolean,
    backNavigationPossible: boolean,
    detailsLoaded: boolean,
    editMode: boolean,
    isSubmitting: boolean
  ): AIKnowledgeBaseDetailsViewModel => ({
    details,
    detailsLoadingIndicator,
    backNavigationPossible,
    detailsLoaded,
    editMode,
    isSubmitting
  })
)
