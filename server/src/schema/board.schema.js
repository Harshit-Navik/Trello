import z from "zod";

const boardSchema = z.object({
    title: z.string().trim().min(3, "Title must contain at least 3 characters"),
    description: z.string().trim().optional()
});

const updatedBoardSchema = z.object({
    title: z.string().trim().min(3, "Title must contain at least 3 characters").optional(),
    description: z.string().trim().min(3, "Description must contain at least 3 characters").optional()
}).refine(
    (data) => data.title !== undefined || data.description !== undefined,
    {
        message: "At least one field (title or description) must be provided"
    }
);


export { boardSchema, updatedBoardSchema }