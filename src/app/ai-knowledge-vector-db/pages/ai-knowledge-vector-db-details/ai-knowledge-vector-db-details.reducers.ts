import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeVectorDbDetailsActions } from './ai-knowledge-vector-db-details.actions'
import { AIKnowledgeVectorDbDetailsState } from './ai-knowledge-vector-db-details.state'

export const initialState: AIKnowledgeVectorDbDetailsState = {
  details: {
    id: '',
    name: '',
    description: '',
    aiContext: {},
    vdb: '',
    vdbCollection: '',
    modificationCount: 0
  },
  contexts: [],
  detailsLoadingIndicator: true,
  detailsLoaded: false,
  contextsLoadingIndicator: true,
  contextsLoaded: false,
  editMode: false,
  isSubmitting: false
}

export const AIKnowledgeVectorDbDetailsReducer = createReducer(
  initialState,
  on(
    AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsReceived,
    (state: AIKnowledgeVectorDbDetailsState, { details }): AIKnowledgeVectorDbDetailsState => {
      console.log('DATA RECEIVED: ', details)
      return {
        ...state,
        details,
        detailsLoadingIndicator: false,
        detailsLoaded: true
      }
    }
  ),
  on(
    AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsLoadingFailed,
    (state: AIKnowledgeVectorDbDetailsState): AIKnowledgeVectorDbDetailsState => ({
      ...state,
      details: initialState.details,
      detailsLoadingIndicator: false,
      detailsLoaded: false
    })
  ),
  on(
    AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbContextsReceived,
    (state: AIKnowledgeVectorDbDetailsState, { contexts }): AIKnowledgeVectorDbDetailsState => ({
      ...state,
      contexts,
      contextsLoadingIndicator: false,
      contextsLoaded: true
    })
  ),
  on(
    AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbContextsLoadingFailed,
    (state: AIKnowledgeVectorDbDetailsState): AIKnowledgeVectorDbDetailsState => ({
      ...state,
      contexts: initialState.contexts,
      contextsLoadingIndicator: false,
      contextsLoaded: false
    })
  ),
  on(
    AIKnowledgeVectorDbDetailsActions.navigatedToDetailsPage,
    (): AIKnowledgeVectorDbDetailsState => ({
      ...initialState
    })
  )
)
