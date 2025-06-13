import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import { filterForNavigatedTo } from '@onecx/ngrx-accelerator'
import { PortalMessageService } from '@onecx/portal-integration-angular'
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs'
import { selectRouteParam } from 'src/app/shared/selectors/router.selectors'
import { AIContextBffService, AIKnowledgeVectorDbBffService, SearchAIContextRequest } from '../../../shared/generated'
import { AIKnowledgeVectorDbDetailsActions } from './ai-knowledge-vector-db-details.actions'
import { AIKnowledgeVectorDbDetailsComponent } from './ai-knowledge-vector-db-details.component'

@Injectable()
export class AIKnowledgeVectorDbDetailsEffects {
  constructor(
    private actions$: Actions,
    private aiKnowledgeVectorDbService: AIKnowledgeVectorDbBffService,
    private aiContextService: AIContextBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService
  ) {}

  navigatedToDetailsPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIKnowledgeVectorDbDetailsComponent),
      concatLatestFrom(() => this.store.select(selectRouteParam('id'))),
      map(([, id]) => {
        return AIKnowledgeVectorDbDetailsActions.navigatedToDetailsPage({
          id
        })
      })
    )
  })

  loadItemById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeVectorDbDetailsActions.navigatedToDetailsPage),
      switchMap(({ id }) =>
        this.aiKnowledgeVectorDbService.getAIKnowledgeVectorDbById(id ?? '').pipe(
          map(({ result }) =>
            AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsReceived({
              details: result
            })
          ),
          catchError((error) =>
            of(
              AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsLoadingFailed({
                error
              })
            )
          )
        )
      ),
      mergeMap((data) => {
        console.log('Details: ', data)
        const fetchAllReq: SearchAIContextRequest = { appId: '', name: '', description: '' }
        // Fetching for contexts
        return this.aiContextService.searchAIContexts(fetchAllReq).pipe(
          map(({ stream }) => {
            // console.log('CONTEXTS_STREAM: ', stream)

            return AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbContextsReceived({
              contexts: stream
            })
          }),
          catchError((error) =>
            of(
              AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbContextsLoadingFailed({
                error
              })
            )
          )
        )
      })
    )
  })

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsLoadingFailed,
      key: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.ERROR_MESSAGES.DETAILS_LOADING_FAILED'
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
