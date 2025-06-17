import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeVectorDbDetailsActions } from './ai-knowledge-vector-db-details.actions'
import { AIKnowledgeVectorDbDetailsState } from './ai-knowledge-vector-db-details.state'

export const initialState: AIKnowledgeVectorDbDetailsState = (() => {
  console.log('InitialState ')

  return {
    details: {
      id: '',
      name: '',
      description: '',
      aiContext: { id: 'id', name: 'name' },
      vdb: '',
      vdbCollection: '',
      modificationCount: 0
    },
    contexts: [],
    detailsLoaded: false,
    detailsLoadingIndicator: true,
    contextsLoaded: false,
    contextsLoadingIndicator: true,
    editMode: false,
    isSubmitting: false
  }
})()

export const AIKnowledgeVectorDbDetailsReducer = createReducer(
  initialState,
  on(
    AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsReceived,
    (state: AIKnowledgeVectorDbDetailsState, { details }): AIKnowledgeVectorDbDetailsState => {
      console.log('DATA RECEIVED - aiKnowledgeVectorDbDetailsReceived: ')
      console.log('details: ', details)
      console.log('future details: ', {
        ...state,
        details,
        detailsLoadingIndicator: false,
        detailsLoaded: true
      })

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
    (state: AIKnowledgeVectorDbDetailsState): AIKnowledgeVectorDbDetailsState => {
      console.log('DATA RECEIVED - aiKnowledgeVectorDbDetailsLoadingFailed', state)

      return {
        ...state,
        details: initialState.details,
        detailsLoadingIndicator: false,
        detailsLoaded: false
      }
    }
  ),
  on(
    AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbContextsReceived,
    (state: AIKnowledgeVectorDbDetailsState, { contexts }): AIKnowledgeVectorDbDetailsState => {
      console.log('DATA RECEIVED - aiKnowledgeVectorDbContextsReceived')
      console.log('state: ', state)
      console.log('future state: ', {
        ...state,
        contexts,
        contextsLoadingIndicator: false,
        contextsLoaded: true
      })

      return {
        ...state,
        contexts,
        contextsLoadingIndicator: false,
        contextsLoaded: true
      }
    }
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
