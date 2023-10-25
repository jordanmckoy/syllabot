import { z } from 'zod'

export const notesSchema = z.object({
    notes: z.string().min(1, { message: "Please enter your notes" }),
    unitId: z.string().min(1, { message: "Please enter your unit id" })
})