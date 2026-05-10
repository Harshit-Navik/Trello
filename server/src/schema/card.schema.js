import z from "zod"

const cardSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "title must have at least three chars"),

    description: z
        .string()
        .trim(),

    position: z
        .number()
});

const updateCardSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "title must have at least three chars")
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),

    position: z
        .number()
        .optional(),

    assignedTo: z
        .string()
        .optional(),

    listId: z
        .string()
        .optional()
}).strict();

export { cardSchema, updateCardSchema }