import z from "zod"

const createOrg = z.object({
    title: z.string().trim().nonempty("Title is required !"),
})

const memberInput = z.object({
    email: z.string().email("Invalid email")
})

export { createOrg , memberInput }