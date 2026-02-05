import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import { toast } from "sonner"
import type { User } from "@/types"


const userFormSchema = z.object({
    firstName: z.string().min(1, "Il nome è obbligatorio"),
    lastName: z.string().min(1, "Il cognome è obbligatorio"),
    email: z.string().email("Inserisci un'email valida"),
    password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
    address: z.string().min(1, "L'indirizzo è obbligatorio")
})

type UserFormValues = z.infer<typeof userFormSchema>


type UserResponse = User

const API_URL = import.meta.env.VITE_API_URL

const CreateUserForm = ({ onFormSubmit }: { onFormSubmit?: (data: UserResponse) => void }) => {

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<UserFormValues>(
        {
            resolver: zodResolver(userFormSchema),
            defaultValues: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                address: ""
            }
        }
    )

    // Debug: mostra errori di validazione
    console.log("Form errors:", errors)

    const onSubmit = async (formData: UserFormValues) => {
        console.log("onSubmit called with:", formData)
        console.log("API_URL:", API_URL)

        try {
            const url = `${API_URL}/api/v1/users`
            console.log("Fetching URL:", url)

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            console.log("Response status:", res.status)
            console.log("Response ok:", res.ok)

            if (!res.ok) {
                const errorText = await res.text()
                console.error("Error response:", errorText)
                throw new Error("Errore durante l'operazione")
            }

            const responseData: UserResponse = await res.json()
            console.log("Response data:", responseData)

            toast.success("Utente creato con successo")
            reset()

            if (onFormSubmit) {
                console.log("Calling onFormSubmit")
                onFormSubmit(responseData)
            }

        } catch (error) {
            console.error("Caught error:", error)
            toast.error("Errore nella richiesta")
        }
    }

    // Assuming isLoadingHosts is defined elsewhere or should be added.
    // For now, it's commented out to avoid a reference error if not defined.
    // const isLoadingHosts = false; // Placeholder if not provided

    return (
        <form
            id="create-user-form"
            className="space-y-4 p-6 bg-card rounded-xl border-2 shadow-sm"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h1 className="text-2xl font-bold">CREATE USER</h1>

            <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        {...register("firstName")}
                        aria-invalid={!!errors.firstName}
                        id="firstName"
                        placeholder="First Name"
                    />
                    {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        {...register("lastName")}
                        aria-invalid={!!errors.lastName}
                        id="lastName"
                        placeholder="Last Name"
                    />
                    {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    {...register("email")}
                    type="email"
                    aria-invalid={!!errors.email}
                    id="email"
                    placeholder="example@example.com"
                />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    {...register("password")}
                    type="password"
                    aria-invalid={!!errors.password}
                    id="password"
                    placeholder="••••••••"
                />
                {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    {...register("address")}
                    aria-invalid={!!errors.address}
                    id="address"
                    placeholder="Via Roma 10, Bari"
                />
                {errors.address && <p className="text-destructive text-xs">{errors.address.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting /* || isLoadingHosts */}>
                {isSubmitting ? "Salvataggio..." : "Create User"}
            </Button>
        </form>
    )
}

export default CreateUserForm