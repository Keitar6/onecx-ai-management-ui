import { routerNavigatedAction, RouterNavigatedAction } from '@ngrx/router-store'
import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeBaseSearchActions } from './ai-knowledge-base-search.actions'
import { AIKnowledgeBaseSearchColumns } from './ai-knowledge-base-search.columns'
import { AIKnowledgeBaseSearchCriteriasSchema } from './ai-knowledge-base-search.parameters'
import { AIKnowledgeBaseSearchState } from './ai-knowledge-base-search.state'

export const initialState: AIKnowledgeBaseSearchState = {
  columns: AIKnowledgeBaseSearchColumns,
  results: [],
  displayedColumns: [],
  chartVisible: false,
  resultComponentState: null,
  searchHeaderComponentState: null,
  diagramComponentState: null,
  searchLoadingIndicator: false,
  criteria: {},
  searchExecuted: false
}

export const AIKnowledgeBaseSearchReducer = createReducer(
  initialState,
  on(routerNavigatedAction, (state: AIKnowledgeBaseSearchState, action: RouterNavigatedAction) => {
    const results = AIKnowledgeBaseSearchCriteriasSchema.safeParse(action.payload.routerState.root.queryParams)
    if (results.success) {
      return {
        ...state,
        criteria: results.data,
        searchLoadingIndicator: Object.keys(action.payload.routerState.root.queryParams).length != 0
      }
    }
    return state
  }),
  on(
    AIKnowledgeBaseSearchActions.resetButtonClicked,
    (state: AIKnowledgeBaseSearchState): AIKnowledgeBaseSearchState => ({
      ...state,
      results: initialState.results,
      criteria: {},
      searchExecuted: false
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.searchButtonClicked,
    (state: AIKnowledgeBaseSearchState, { searchCriteria }): AIKnowledgeBaseSearchState => ({
      ...state,
      criteria: searchCriteria
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.aIKnowledgeBaseSearchResultsReceived,
    (state: AIKnowledgeBaseSearchState, { stream }): AIKnowledgeBaseSearchState => ({
      ...state,
      results: stream,
      searchLoadingIndicator: false,
      searchExecuted: true
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.aIKnowledgeBaseSearchResultsLoadingFailed,
    (state: AIKnowledgeBaseSearchState): AIKnowledgeBaseSearchState => ({
      ...state,
      results: [],
      searchLoadingIndicator: false
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.chartVisibilityToggled,
    (state: AIKnowledgeBaseSearchState): AIKnowledgeBaseSearchState => ({
      ...state,
      chartVisible: !state.chartVisible
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.resultComponentStateChanged,
    (state: AIKnowledgeBaseSearchState, resultComponentState): AIKnowledgeBaseSearchState => ({
      ...state,
      resultComponentState
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.searchHeaderComponentStateChanged,
    (state: AIKnowledgeBaseSearchState, searchHeaderComponentState): AIKnowledgeBaseSearchState => ({
      ...state,
      searchHeaderComponentState
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.diagramComponentStateChanged,
    (state: AIKnowledgeBaseSearchState, diagramComponentState): AIKnowledgeBaseSearchState => ({
      ...state,
      diagramComponentState
    })
  ),
  on(
    AIKnowledgeBaseSearchActions.displayedColumnsChanged,
    (state: AIKnowledgeBaseSearchState, { displayedColumns }): AIKnowledgeBaseSearchState => ({
      ...state,

      displayedColumns: displayedColumns.map((v) => v.id)
    })
  )
)
