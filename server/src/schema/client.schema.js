import z from "zod"

const signUpUser = z.object({
    fullName: z.string().nonempty("fullName is required !!"),
    username: z.string().nonempty("username is required field !!"),
    email: z.string().email(),
    password: z.string().min(6)
})

const loginUser = z.object({
    email: z.string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email"),
    password: z.string({ required_error: "password is required" })
        .trim()
        .min(6, "Min 6 characters are required")
})

const passwordSchema = z.object({
    oldPassword: z.string().trim().min(6, "Min 6 characters are required"),
    newPassword: z.string().trim().min(6, "Min 6 characters are required")
})

export { signUpUser, loginUser, passwordSchema };