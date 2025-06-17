import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Action, BreadcrumbService } from '@onecx/portal-integration-angular'
import { combineLatest, map, Observable, tap } from 'rxjs'

import { PrimeIcons } from 'primeng/api'
import { selectAIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.selectors'
import { AIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.viewmodel'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AIKnowledgeVectorDbSearchActions } from '../ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.actions'
import { AIContext } from 'src/app/shared/generated'

@Component({
  selector: 'app-ai-knowledge-vector-db-details',
  templateUrl: './ai-knowledge-vector-db-details.component.html',
  styleUrls: ['./ai-knowledge-vector-db-details.component.scss']
})
export class AIKnowledgeVectorDbDetailsComponent implements OnInit {
  public formGroup: FormGroup
  viewModel$: Observable<AIKnowledgeVectorDbDetailsViewModel>
  headerActions$: Observable<Action[]>
  displayContexts$: Observable<{ label: string; value: AIContext }[]>

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.maxLength(255)]),
      description: new FormControl('', [Validators.maxLength(255)]),
      vdb: new FormControl('', [Validators.maxLength(255)]),
      vdbCollection: new FormControl('', [Validators.maxLength(255)]),
      aiContext: new FormControl({ label: '', value: {} })
    })

    this.viewModel$ = this.store
      .select(selectAIKnowledgeVectorDbDetailsViewModel)
      .pipe(tap((value) => console.log('first: ', value)))
    // .pipe(tap((value) => console.log('seconds: ', value)))

    this.headerActions$ = this.viewModel$.pipe(
      map((vm) => {
        const actions: Action[] = [
          {
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.BACK',
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.BACK',
            show: 'always',
            icon: PrimeIcons.ARROW_LEFT,
            actionCallback: () => {
              window.history.back()
            }
          },
          {
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.EDIT',
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.EDIT',
            show: 'always',
            icon: PrimeIcons.PENCIL,
            actionCallback: () => {
              this.edit(vm.details?.id ?? '')
            }
          },
          {
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.DELETE',
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.DELETE',
            icon: PrimeIcons.TRASH,
            show: 'asOverflow',
            btnClass: '',
            actionCallback: () => {
              this.delete(vm.details?.id ?? '')
            }
          }
        ]
        return actions
      })
    )
    this.displayContexts$ = this.viewModel$.pipe(map(({ contexts }) => this.getContextFormValue(contexts)))
  }

  ngOnInit(): void {
    combineLatest([this.viewModel$, this.displayContexts$]).subscribe(([vm, contexts]) => {
      const matchedContext = contexts.find((context) => context.value.id === vm.details?.aiContext?.id) ?? null
      this.formGroup.patchValue({
        name: vm.details?.name ?? '',
        description: vm.details?.description,
        vdb: vm.details?.vdb,
        vdbCollection: vm.details?.vdbCollection,
        aiContext: matchedContext
      })

      if (vm.editMode) {
        this.formGroup.enable()
      } else {
        this.formGroup.disable()
      }
    })

    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.BREADCRUMB',
        routerLink: '/ai-knowledge-vector-db'
      }
    ])

    this.store.select(selectAIKnowledgeVectorDbDetailsViewModel).pipe(tap((value) => console.log('second: ', value)))
  }

  getContextFormValue(contexts: AIContext[]) {
    return contexts.map((context) => ({ label: `${context.id}:${context.name}`, value: context }))
  }

  edit(id: string) {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.editAiKnowledgeVectorDbButtonClicked({ id }))
  }

  delete(id: string) {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.deleteAiKnowledgeVectorDbButtonClicked({ id }))
  }
}
