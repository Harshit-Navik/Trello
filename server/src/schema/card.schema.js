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

    assignedTo: z
        .string()
        .optional(),

}).strict();

const moveCardSchema = z.object({

    newPosition: z
        .number()
        .optional(),

    newListId: z
        .string()
        .optional()
})

export { cardSchema, updateCardSchema, moveCardSchema }