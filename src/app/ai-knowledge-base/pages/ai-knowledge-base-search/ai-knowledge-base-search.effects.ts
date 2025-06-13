import { Injectable, SkipSelf } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import { filterForNavigatedTo, filterOutQueryParamsHaveNotChanged } from '@onecx/ngrx-accelerator'
import {
  DialogState,
  ExportDataService,
  PortalDialogService,
  PortalMessageService
} from '@onecx/portal-integration-angular'
import equal from 'fast-deep-equal'
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs'
import { PrimeIcons } from 'primeng/api'
import { selectUrl } from 'src/app/shared/selectors/router.selectors'
import {
  AIKnowledgeBase,
  AIKnowledgeBaseBffService,
  CreateAIKnowledgeBaseRequest,
  UpdateAIKnowledgeBaseRequest
} from '../../../shared/generated'
import { AIKnowledgeBaseSearchActions } from './ai-knowledge-base-search.actions'
import { AIKnowledgeBaseSearchComponent } from './ai-knowledge-base-search.component'
import { AIKnowledgeBaseSearchCriteriasSchema } from './ai-knowledge-base-search.parameters'
import {
  AIKnowledgeBaseSearchSelectors,
  selectAIKnowledgeBaseSearchViewModel
} from './ai-knowledge-base-search.selectors'
import { AIKnowledgeBaseCreateUpdateComponent } from './dialogs/aiknowledge-base-create-update/aiknowledge-base-create-update.component'

@Injectable()
export class AIKnowledgeBaseSearchEffects {
  constructor(
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private aIKnowledgeBaseService: AIKnowledgeBaseBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService,
    private portalDialogService: PortalDialogService,

    private readonly exportDataService: ExportDataService
  ) {}

  syncParamsToUrl$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIKnowledgeBaseSearchActions.searchButtonClicked, AIKnowledgeBaseSearchActions.resetButtonClicked),
        concatLatestFrom(() => [
          this.store.select(AIKnowledgeBaseSearchSelectors.selectCriteria),
          this.route.queryParams
        ]),
        tap(([, criteria, queryParams]) => {
          const results = AIKnowledgeBaseSearchCriteriasSchema.safeParse(queryParams)
          if (!results.success || !equal(criteria, results.data)) {
            const params = {
              ...criteria
              //TODO: Move to docs to explain how to only put the date part in the URL in case you have date and not datetime
              //exampleDate: criteria.exampleDate?.toISOString()?.slice(0, 10)
            }
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: params,
              replaceUrl: true,
              onSameUrlNavigation: 'ignore'
            })
          }
        })
      )
    },
    { dispatch: false }
  )

  detailsButtonClicked$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIKnowledgeBaseSearchActions.detailsButtonClicked),
        concatLatestFrom(() => this.store.select(selectUrl)),
        tap(([action, currentUrl]) => {
          const urlTree = this.router.parseUrl(currentUrl)
          urlTree.queryParams = {}
          urlTree.fragment = null
          this.router.navigate([urlTree.toString(), 'details', action.id])
        })
      )
    },
    { dispatch: false }
  )

  deleteButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeBaseSearchActions.deleteButtonClicked),
      concatLatestFrom(() => this.store.select(AIKnowledgeBaseSearchSelectors.selectResults)),
      mergeMap(([action, results]) => {
        const itemToDelete = results.find((item) => item.id === action.id)
        console.log('ItemTO DELETEI: ', itemToDelete)
        return this.portalDialogService
          .openDialog<unknown>(
            'AI_KNOWLEDGE_BASE_DETAILS.DELETE.HEADER',
            'AI_KNOWLEDGE_BASE_DETAILS.DELETE.MESSAGE',
            {
              key: 'AI_KNOWLEDGE_BASE_DETAILS.DELETE.CONFIRM',
              icon: PrimeIcons.CHECK
            },
            {
              key: 'AI_KNOWLEDGE_BASE_DETAILS.DELETE.CANCEL',
              icon: PrimeIcons.TIMES
            }
          )
          .pipe(
            map((state): [DialogState<unknown>, AIKnowledgeBase | undefined] => {
              return [state, itemToDelete]
            })
          )
      }),
      switchMap(([dialogResult, itemToDelete]) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIKnowledgeBaseSearchActions.deleteAIKnowledgeBaseCancelled())
        }
        if (!itemToDelete) {
          throw new Error('Item to delete not found!')
        }

        return this.aIKnowledgeBaseService.deleteAIKnowledgeBase(itemToDelete.id).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_KNOWLEDGE_BASE_DETAILS.DELETE.SUCCESS'
            })
            return AIKnowledgeBaseSearchActions.deleteAIKnowledgeBaseSucceeded()
          }),
          catchError((error) => {
            this.messageService.error({
              summaryKey: 'AI_KNOWLEDGE_BASE_DETAILS.DELETE.ERROR'
            })
            return of(
              AIKnowledgeBaseSearchActions.deleteAIKnowledgeBaseFailed({
                error
              })
            )
          })
        )
      })
    )
  })

  createButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeBaseSearchActions.createButtonClicked),
      switchMap(() => {
        return this.portalDialogService.openDialog<AIKnowledgeBase | undefined>(
          'AI_KNOWLEDGE_BASE_CREATE_UPDATE.CREATE.HEADER',
          {
            type: AIKnowledgeBaseCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit: {}
              }
            }
          },
          'AI_KNOWLEDGE_BASE_CREATE_UPDATE.CREATE.FORM.SAVE',
          'AI_KNOWLEDGE_BASE_CREATE_UPDATE.CREATE.FORM.CANCEL',
          {
            baseZIndex: 100
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIKnowledgeBaseSearchActions.createAIKnowledgeBaseCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const toCreateItem = {
          aIKnowledgeDocumentData: dialogResult.result
        } as CreateAIKnowledgeBaseRequest
        return this.aIKnowledgeBaseService.createAIKnowledgeBase(toCreateItem).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_KNOWLEDGE_BASE_CREATE_UPDATE.CREATE.SUCCESS'
            })
            return AIKnowledgeBaseSearchActions.createAIKnowledgeBaseSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_KNOWLEDGE_BASE_CREATE_UPDATE.CREATE.ERROR'
        })
        return of(
          AIKnowledgeBaseSearchActions.createAIKnowledgeBaseFailed({
            error
          })
        )
      })
    )
  })

  editButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeBaseSearchActions.editButtonClicked),
      concatLatestFrom(() => this.store.select(AIKnowledgeBaseSearchSelectors.selectResults)),
      map(([action, results]) => {
        return results.find((item) => item.id == action.id)
      }),
      mergeMap((itemToEdit) => {
        return this.portalDialogService.openDialog<AIKnowledgeBase | undefined>(
          'AI_KNOWLEDGE_BASE_CREATE_UPDATE.UPDATE.HEADER',
          {
            type: AIKnowledgeBaseCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit
              }
            }
          },
          'AI_KNOWLEDGE_BASE_CREATE_UPDATE.UPDATE.FORM.SAVE',
          'AI_KNOWLEDGE_BASE_CREATE_UPDATE.UPDATE.FORM.CANCEL',
          {
            baseZIndex: 100
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIKnowledgeBaseSearchActions.editAIKnowledgeBaseCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const itemToEditId = dialogResult.result.id
        const itemToEdit = {
          aIKnowledgeDocumentData: dialogResult.result
        } as UpdateAIKnowledgeBaseRequest
        return this.aIKnowledgeBaseService.updateAIKnowledgeBase(itemToEditId, itemToEdit).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_KNOWLEDGE_BASE_CREATE_UPDATE.UPDATE.SUCCESS'
            })
            return AIKnowledgeBaseSearchActions.editAIKnowledgeBaseSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_KNOWLEDGE_BASE_CREATE_UPDATE.UPDATE.ERROR'
        })
        return of(
          AIKnowledgeBaseSearchActions.editAIKnowledgeBaseFailed({
            error
          })
        )
      })
    )
  })

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIKnowledgeBaseSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, AIKnowledgeBaseSearchCriteriasSchema, false),
      concatLatestFrom(() => this.store.select(AIKnowledgeBaseSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  performSearch(searchCriteria: Record<string, any>) {
    return this.aIKnowledgeBaseService
      .searchAIKnowledgeBases({
        ...Object.entries(searchCriteria).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value instanceof Date ? value.toISOString() : value
          }),
          {}
        ),
        id: +searchCriteria['id']
      })
      .pipe(
        map(({ stream, size, number, totalElements, totalPages }) =>
          AIKnowledgeBaseSearchActions.aIKnowledgeBaseSearchResultsReceived({
            stream,
            size,
            number,
            totalElements,
            totalPages
          })
        ),
        catchError((error) =>
          of(
            AIKnowledgeBaseSearchActions.aIKnowledgeBaseSearchResultsLoadingFailed({
              error
            })
          )
        )
      )
  }

  exportData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIKnowledgeBaseSearchActions.exportButtonClicked),
        concatLatestFrom(() => this.store.select(selectAIKnowledgeBaseSearchViewModel)),
        map(([, viewModel]) => {
          this.exportDataService.exportCsv(
            viewModel.resultComponentState?.displayedColumns ?? [],
            viewModel.results,
            'AIKnowledgeBase.csv'
          )
        })
      )
    },
    { dispatch: false }
  )

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AIKnowledgeBaseSearchActions.aIKnowledgeBaseSearchResultsLoadingFailed,
      key: 'AI_KNOWLEDGE_BASE_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
    }
  ]

  displayError$ = createEffect(
    () => {
      return this.actions$.pipe(
        tap((action) => {
          const e = this.errorMessages.find((e) => e.action.type === action.type)
          if (e) {
            this.messageService.error({ summaryKey: e.key })
          }
        })
      )
    },
    { dispatch: false }
  )
}
