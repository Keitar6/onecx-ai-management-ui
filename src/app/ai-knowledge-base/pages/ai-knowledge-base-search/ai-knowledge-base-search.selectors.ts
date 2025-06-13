import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { RowListGridData } from '@onecx/portal-integration-angular'
import { AIKnowledgeBaseFeature } from '../../ai-knowledge-base.reducers'
import { initialState } from './ai-knowledge-base-search.reducers'
import { AIKnowledgeBaseSearchViewModel } from './ai-knowledge-base-search.viewmodel'

export const AIKnowledgeBaseSearchSelectors = createChildSelectors(AIKnowledgeBaseFeature.selectSearch, initialState)

export const selectResults = createSelector(
  AIKnowledgeBaseSearchSelectors.selectResults,
  (results): RowListGridData[] => {
    return results.map((item) => ({
      imagePath: '',
      ...item
      // ACTION S7: Create a mapping of the items and their corresponding translation keys
      // https://onecx.github.io/docs/nx-plugins/current/general/getting_started/search/configure-search-results.html#action-7
    }))
  }
)

export const selectAIKnowledgeBaseSearchViewModel = createSelector(
  AIKnowledgeBaseSearchSelectors.selectColumns,
  AIKnowledgeBaseSearchSelectors.selectCriteria,
  selectResults,
  AIKnowledgeBaseSearchSelectors.selectResultComponentState,
  AIKnowledgeBaseSearchSelectors.selectSearchHeaderComponentState,
  AIKnowledgeBaseSearchSelectors.selectDiagramComponentState,
  AIKnowledgeBaseSearchSelectors.selectChartVisible,
  AIKnowledgeBaseSearchSelectors.selectSearchLoadingIndicator,
  AIKnowledgeBaseSearchSelectors.selectSearchExecuted,
  (
    columns,
    searchCriteria,
    results,
    resultComponentState,
    searchHeaderComponentState,
    diagramComponentState,
    chartVisible,
    searchLoadingIndicator,
    searchExecuted
  ): AIKnowledgeBaseSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    resultComponentState,
    searchHeaderComponentState,
    diagramComponentState,
    chartVisible,
    searchLoadingIndicator,
    searchExecuted
  })
)
