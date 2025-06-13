import { Routes } from '@angular/router'
import { AIKnowledgeBaseDetailsComponent } from './pages/ai-knowledge-base-details/ai-knowledge-base-details.component'
import { AIKnowledgeBaseSearchComponent } from './pages/ai-knowledge-base-search/ai-knowledge-base-search.component'

export const routes: Routes = [
  { path: 'details/:id', component: AIKnowledgeBaseDetailsComponent, pathMatch: 'full' },
  { path: '', component: AIKnowledgeBaseSearchComponent, pathMatch: 'full' }
]
