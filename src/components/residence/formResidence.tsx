import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import { toast } from "sonner"
import type { Host, Residence, ColorType } from "@/types"
import { colorClasses } from "@/types"
import { cn } from "@/lib/utils"

const residenceFormSchema = z.object({
    name: z.string().min(1, "Il nome è obbligatorio"),
    address: z.string().min(1, "L'indirizzo è obbligatorio"),
    numberOfRooms: z.number().min(1, "Minimo 1 stanza"),
    guestCapacity: z.number().min(1, "Capacità minima 1 ospite"),
    floor: z.number(),
    price: z.number().min(0, "Il prezzo deve essere positivo"),
    availableFrom: z.string().min(1, "Data inizio obbligatoria"),
    availableTo: z.string().min(1, "Data fine obbligatoria"),
    hostId: z.number()
})

type ResidenceFormValues = z.infer<typeof residenceFormSchema>

const API_URL = import.meta.env.VITE_API_URL

const CreateResidenceForm = ({ onFormSubmit, color }: { onFormSubmit?: (data: Residence) => void, color: ColorType }) => {
    const [hosts, setHosts] = useState<Host[]>([])
    const [isLoadingHosts, setIsLoadingHosts] = useState(true)

    useEffect(() => {
        const fetchHosts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/v1/hosts`)
                if (!res.ok) throw new Error("Errore nel caricamento host")
                const data = await res.json()
                setHosts(data)
            } catch (error) {
                toast.error("Impossibile caricare la lista degli host")
            } finally {
                setIsLoadingHosts(false)
            }
        }
        fetchHosts()
    }, [API_URL])

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ResidenceFormValues>({
        resolver: zodResolver(residenceFormSchema),
        defaultValues: {
            name: "",
            address: "",
            numberOfRooms: 1,
            guestCapacity: 1,
            floor: 0,
            price: 0,
            availableFrom: "",
            availableTo: "",
            hostId: 0
        }
    })

    const onSubmit = async (formData: ResidenceFormValues) => {
        try {

            const url = `${API_URL}/api/v1/residence`

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData) // hostId è incluso qui
            })

            if (!res.ok) throw new Error("Errore durante la creazione")

            const responseData: Residence = await res.json()
            toast.success("Residenza creata con successo")
            reset()

            if (onFormSubmit) onFormSubmit(responseData)
        } catch (error) {
            toast.error("Errore nella richiesta")
        }
    }

    return (
        <form className="space-y-4 max-w-xl mx-auto p-6" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-bold text-center mb-6">CREATE RESIDENCE</h1>

            <div className="space-y-2">
                <Label htmlFor="hostId">Select Host</Label>
                <select
                    {...register("hostId")}
                    id="hostId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">{isLoadingHosts ? "Loading hosts..." : "Choose an host"}</option>
                    {hosts.map((host) => (
                        <option key={host.id} value={host.id}>
                            {host.firstName} - {host.lastName} ({host.email})
                        </option>
                    ))}
                </select>
                {errors.hostId && <p className="text-destructive text-xs">{errors.hostId.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Residence Name</Label>
                <Input {...register("name")} id="name" placeholder="es. Villa Diamante" />
                {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input {...register("address")} id="address" placeholder="Costa Diamante 7" />
                {errors.address && <p className="text-destructive text-xs">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="numberOfRooms">Rooms</Label>
                    <Input {...register("numberOfRooms")} type="number" id="numberOfRooms" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="guestCapacity">Guest Capacity</Label>
                    <Input {...register("guestCapacity")} type="number" id="guestCapacity" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input {...register("floor")} type="number" id="floor" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input {...register("price")} type="number" step="0.01" id="price" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Input {...register("availableFrom")} type="date" id="availableFrom" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="availableTo">Available To</Label>
                    <Input {...register("availableTo")} type="date" id="availableTo" />
                </div>
            </div>

            <Button type="submit" className={cn("w-full", colorClasses[color].button)} disabled={isSubmitting || isLoadingHosts}>
                {isSubmitting ? "Saving..." : "Create Residence"}
            </Button>
        </form>
    )
}

export default CreateResidenceForm