import { z } from 'zod'

const choiceSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  consequence: z.string().min(1),
  correct: z.boolean(),
  imageUrl: z.string().optional(),
  consequenceImageUrl: z.string().optional(),
})

export const multipleChoicePayloadSchema = z.object({
  type: z.literal('MULTIPLE_CHOICE'),
  scenario: z.string().optional(),
  question: z.string().min(1),
  choices: z.array(choiceSchema).min(2),
  scenarioImageUrl: z.string().optional(),
})

export type MultipleChoicePayload = z.infer<typeof multipleChoicePayloadSchema>
export type Choice = z.infer<typeof choiceSchema>
