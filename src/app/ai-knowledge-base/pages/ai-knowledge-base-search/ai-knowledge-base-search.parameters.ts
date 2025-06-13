import { SearchAIKnowledgeBaseRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const AIKnowledgeBaseSearchCriteriasSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional()
  // ACTION S2: Please define the members for your AIKnowledgeBaseSearchCriteriasSchema here
  // https://onecx.github.io/docs/nx-plugins/current/general/getting_started/search/configure-search-criteria.html#action-2
} satisfies Partial<Record<keyof SearchAIKnowledgeBaseRequest, ZodTypeAny>>)

export type AIKnowledgeBaseSearchCriteria = z.infer<typeof AIKnowledgeBaseSearchCriteriasSchema>
