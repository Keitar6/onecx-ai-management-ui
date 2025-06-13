import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeBaseDetailsActions } from './ai-knowledge-base-details.actions'
import { AIKnowledgeBaseDetailsState } from './ai-knowledge-base-details.state'

export const initialState: AIKnowledgeBaseDetailsState = {
  details: { id: '', name: '', description: '', contexts: [], modificationCount: 0 },
  detailsLoadingIndicator: true,
  detailsLoaded: false,
  editMode: false,
  isSubmitting: false
}

export const AIKnowledgeBaseDetailsReducer = createReducer(
  initialState,
  on(
    AIKnowledgeBaseDetailsActions.aIKnowledgeBaseDetailsReceived,
    (state: AIKnowledgeBaseDetailsState, { details }): AIKnowledgeBaseDetailsState => ({
      ...state,
      details,
      detailsLoadingIndicator: false,
      detailsLoaded: true
    })
  ),
  on(
    AIKnowledgeBaseDetailsActions.aIKnowledgeBaseDetailsLoadingFailed,
    (state: AIKnowledgeBaseDetailsState): AIKnowledgeBaseDetailsState => ({
      ...state,
      details: initialState.details,
      detailsLoadingIndicator: false,
      detailsLoaded: false
    })
  ),
  on(
    AIKnowledgeBaseDetailsActions.navigatedToDetailsPage,
    (): AIKnowledgeBaseDetailsState => ({
      ...initialState
    })
  ),
  on(
    AIKnowledgeBaseDetailsActions.editButtonClicked,
    (state: AIKnowledgeBaseDetailsState): AIKnowledgeBaseDetailsState => ({
      ...state,
      editMode: true
    })
  ),
  on(
    AIKnowledgeBaseDetailsActions.saveButtonClicked,
    (state: AIKnowledgeBaseDetailsState, { details }): AIKnowledgeBaseDetailsState => ({
      ...state,
      details,
      editMode: false,
      isSubmitting: true
    })
  ),
  on(
    AIKnowledgeBaseDetailsActions.cancelEditConfirmClicked,
    AIKnowledgeBaseDetailsActions.cancelEditNotDirty,
    AIKnowledgeBaseDetailsActions.updateAIKnowledgeBaseCancelled,
    AIKnowledgeBaseDetailsActions.updateAIKnowledgeBaseSucceeded,
    (state: AIKnowledgeBaseDetailsState): AIKnowledgeBaseDetailsState => ({
      ...state,
      editMode: false,
      isSubmitting: false
    })
  ),
  on(
    AIKnowledgeBaseDetailsActions.updateAIKnowledgeBaseFailed,
    (state: AIKnowledgeBaseDetailsState): AIKnowledgeBaseDetailsState => ({
      ...state,
      isSubmitting: false
    })
  )
)
