import z from "zod"

const createOrg = z.object({
    title: z.string().trim().nonempty("Title is required !"),
})

const memberInput = z.object({
    email: z.string().email("Invalid email")
})

const title = z.object({
    title: z.string().trim().min(3, "title must contain atleast 3 characters").nonempty("Title is required !")
})

export { createOrg , memberInput , title }