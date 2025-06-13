import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { isValidDate } from '@onecx/accelerator'
import {
  Action,
  BreadcrumbService,
  DataSortDirection,
  DataTableColumn,
  DiagramComponentState,
  DiagramType,
  ExportDataService,
  InteractiveDataViewComponentState,
  RowListGridData,
  SearchHeaderComponentState
} from '@onecx/portal-integration-angular'
import { PrimeIcons } from 'primeng/api'
import { map, Observable } from 'rxjs'
import { AIKnowledgeBaseSearchActions } from './ai-knowledge-base-search.actions'
import {
  AIKnowledgeBaseSearchCriteria,
  AIKnowledgeBaseSearchCriteriasSchema
} from './ai-knowledge-base-search.parameters'
import { selectAIKnowledgeBaseSearchViewModel } from './ai-knowledge-base-search.selectors'
import { AIKnowledgeBaseSearchViewModel } from './ai-knowledge-base-search.viewmodel'

@Component({
  selector: 'app-ai-knowledge-base-search',
  templateUrl: './ai-knowledge-base-search.component.html',
  styleUrls: ['./ai-knowledge-base-search.component.scss']
})
export class AIKnowledgeBaseSearchComponent implements OnInit {
  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public readonly locale: string,
    private readonly exportDataService: ExportDataService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_KNOWLEDGE_BASE_SEARCH.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_BASE_SEARCH.BREADCRUMB',
        routerLink: '/ai-knowledge-base'
      }
    ])
    this.viewModel$.subscribe((vm) => this.AIKnowledgeBaseSearchFormGroup.patchValue(vm.searchCriteria))
  }

  viewModel$: Observable<AIKnowledgeBaseSearchViewModel> = this.store.select(selectAIKnowledgeBaseSearchViewModel)

  defaultDataSortDirection = DataSortDirection.NONE
  defaultDiagramType = DiagramType.PIE

  // ACTION S10: Update header actions: https://onecx.github.io/docs/nx-plugins/current/general/getting_started/search/update-header-actions.html#action-10
  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          labelKey: 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.CREATE_BASE',
          icon: PrimeIcons.PLUS,
          titleKey: 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.CREATE_BASE',
          show: 'always',
          actionCallback: () => this.createAIKnowledgeBase()
        },
        {
          labelKey: 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          icon: PrimeIcons.DOWNLOAD,
          titleKey: 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          show: 'asOverflow',
          actionCallback: () => this.exportItems()
        },
        {
          labelKey: vm.chartVisible
            ? 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          icon: PrimeIcons.EYE,
          titleKey: vm.chartVisible
            ? 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'AI_KNOWLEDGE_BASE_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          show: 'asOverflow',
          actionCallback: () => this.toggleChartVisibility()
        }
      ]
      return actions
    })
  )

  // ACTION S9: Select the column to be displayed in the diagram: https://onecx.github.io/docs/nx-plugins/current/general/getting_started/search/configure-result-diagram.html#action-3
  diagramColumnId = 'id'
  diagramColumn$ = this.viewModel$.pipe(
    map((vm) => vm.columns.find((e) => e.id === this.diagramColumnId) as DataTableColumn)
  )

  public AIKnowledgeBaseSearchFormGroup: FormGroup = this.formBuilder.group({
    ...(Object.fromEntries(AIKnowledgeBaseSearchCriteriasSchema.keyof().options.map((k) => [k, null])) as Record<
      keyof AIKnowledgeBaseSearchCriteria,
      unknown
    >)
  } satisfies Record<keyof AIKnowledgeBaseSearchCriteria, unknown>)

  resultComponentStateChanged(state: InteractiveDataViewComponentState) {
    this.store.dispatch(AIKnowledgeBaseSearchActions.resultComponentStateChanged(state))
  }

  searchHeaderComponentStateChanged(state: SearchHeaderComponentState) {
    this.store.dispatch(AIKnowledgeBaseSearchActions.searchHeaderComponentStateChanged(state))
  }

  diagramComponentStateChanged(state: DiagramComponentState) {
    this.store.dispatch(AIKnowledgeBaseSearchActions.diagramComponentStateChanged(state))
  }

  search(formValue: FormGroup) {
    const searchCriteria = Object.entries(formValue.getRawValue()).reduce(
      (acc: Partial<AIKnowledgeBaseSearchCriteria>, [key, value]) => ({
        ...acc,
        [key]: isValidDate(value)
          ? new Date(
              Date.UTC(
                value.getFullYear(),
                value.getMonth(),
                value.getDate(),
                value.getHours(),
                value.getMinutes(),
                value.getSeconds()
              )
            )
          : value || undefined
      }),
      {}
    )

    this.store.dispatch(AIKnowledgeBaseSearchActions.searchButtonClicked({ searchCriteria }))
  }

  details({ id }: RowListGridData) {
    this.store.dispatch(AIKnowledgeBaseSearchActions.detailsButtonClicked({ id }))
  }

  createAIKnowledgeBase() {
    this.store.dispatch(AIKnowledgeBaseSearchActions.createButtonClicked())
  }

  edit({ id }: RowListGridData) {
    this.store.dispatch(AIKnowledgeBaseSearchActions.editButtonClicked({ id }))
  }

  delete({ id }: RowListGridData) {
    this.store.dispatch(AIKnowledgeBaseSearchActions.deleteButtonClicked({ id }))
  }

  resetSearch() {
    this.store.dispatch(AIKnowledgeBaseSearchActions.resetButtonClicked())
  }

  exportItems() {
    this.store.dispatch(AIKnowledgeBaseSearchActions.exportButtonClicked())
  }

  toggleChartVisibility() {
    this.store.dispatch(AIKnowledgeBaseSearchActions.chartVisibilityToggled())
  }

  onDisplayedColumnsChange(displayedColumns: DataTableColumn[]) {
    this.store.dispatch(AIKnowledgeBaseSearchActions.displayedColumnsChanged({ displayedColumns }))
  }
}
