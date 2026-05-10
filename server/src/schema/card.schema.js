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

export { cardSchema }