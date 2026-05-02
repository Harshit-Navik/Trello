import z from "zod";

const boardSchema = z.object({
    title: z.string().trim().min(3, "Title must contain at least 3 characters"),
    description: z.string().trim().optional()
});

const updatedBoardSchema = z.object({
    title: z.string().trim().min(3, "Title must contain at least 3 characters"),
    description: z.string().trim().min(3, "Title must contain at least 3 characters")
});


export { boardSchema, updatedBoardSchema }