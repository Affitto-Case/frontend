# Luxury Tourist - Frontend

Interfaccia web moderna per la gestione di una piattaforma di affitti turistici di lusso. Costruita con React, TypeScript, Vite, Tailwind CSS e Shadcn/UI.

## 🚀 Quick Start

```bash
# Clone del repository
git clone <repository-url>
cd luxury-tourist-frontend

# Installazione dipendenze
pnpm install

# Configurazione ambiente
cp .env.example .env
# Modifica .env con l'URL del tuo backend

# Avvia il server di sviluppo
pnpm dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 📋 Prerequisiti

- **Node.js**: 18+
- **pnpm**: 8+ (consigliato) o **npm**: 9+
- **Backend API**: Deve essere in esecuzione su `http://localhost:8080`

## ⚙️ Configurazione

### .env

```env
VITE_API_URL=http://localhost:8080
```

## 📁 Struttura del Progetto

```
src/
├── components/              # Componenti organizzati per dominio
│   ├── booking/            # Gestione prenotazioni
│   │   ├── TableBooking.tsx
│   │   ├── CreateBookingForm.tsx
│   │   └── BookingDetailsDialog.tsx
│   │
│   ├── feedback/           # Gestione recensioni
│   │   ├── TableFeedback.tsx
│   │   ├── CreateFeedbackForm.tsx
│   │   └── FeedbackCard.tsx
│   │
│   ├── residence/          # Gestione residenze
│   │   ├── TableResidence.tsx
│   │   ├── CreateResidenceForm.tsx
│   │   └── ResidenceCard.tsx
│   │
│   ├── user/               # Gestione utenti
│   │   ├── TableUser.tsx
│   │   ├── CreateUserForm.tsx
│   │   └── PromoteUserDialog.tsx
│   │
│   ├── host/               # Gestione host
│   │   ├── TableHost.tsx
│   │   └── HostStatsCard.tsx
│   │
│   ├── common/             # Componenti condivisi
│   │   ├── buttonManage.tsx    # Pulsanti CRUD
│   │   ├── buttonOp.tsx        # Pulsanti operazioni custom
│   │   ├── layout.tsx          # Layout components
│   │   └── cards.tsx           # Card informative
│   │
│   └── ui/                 # Shadcn/UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── table.tsx
│       ├── card.tsx
│       └── ...
│
├── pages/                  # Pagine dell'applicazione
│   ├── Homepage.tsx        # Dashboard con overview
│   ├── UserManage.tsx      # CRUD Utenti
│   ├── HostManage.tsx      # CRUD Host
│   ├── ResidenceManage.tsx # CRUD Residenze
│   ├── BookingManage.tsx   # CRUD Prenotazioni
│   ├── FeedbackManage.tsx  # CRUD Feedback
│   │
│   └── queries/            # Pagine per query custom
│       ├── ResidenceByHostCode.tsx
│       ├── LastUserBooking.tsx
│       ├── MostPopularResidence.tsx
│       ├── TopHosts.tsx
│       ├── SuperHosts.tsx
│       ├── TopUsersMonthly.tsx
│       └── AvgBedsStats.tsx
│
├── types/                  # TypeScript definitions
│   └── index.ts           # Tutte le interfacce e types
│
├── utils/                  # Utility functions
│   └── queryCustom.tsx    # Componenti statistiche riutilizzabili
│
├── App.tsx                 # Root component + Router
├── main.tsx                # Entry point
└── index.css               # Global styles + Tailwind
```

## 🏗️ Architettura

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Pages Layer                 │  Orchestrazione componenti
│  (Homepage, UserManage, etc.)       │  Gestione stato globale pagina
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Component Layer                │  Componenti di dominio
│  (TableUser, CreateBookingForm)     │  Logica business specifica
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       UI Component Layer            │  Componenti riutilizzabili
│      (Shadcn/UI Primitives)         │  Button, Input, Dialog, etc.
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         API Layer                   │  Comunicazione backend
│    (fetch calls + error handling)   │  REST API calls
└─────────────────────────────────────┘
```

## 🔌 Funzionalità Principali

### 1. CRUD Management

Ogni entità (User, Host, Residence, Booking, Feedback) ha una pagina dedicata con:

- ✅ **Create**: Form per creare nuovi record
- ✅ **Read**: Tabelle con visualizzazione dati
- ✅ **Update**: Dialog per modificare record esistenti
- ✅ **Delete**: Eliminazione con conferma

### 2. Custom Queries

Pagine dedicate per statistiche e query avanzate:

- **Top Hosts del Mese**: Classifica host con più prenotazioni
- **Super Hosts**: Lista di host premium
- **Residenze per Host Code**: Ricerca residenze per codice host
- **Ultima Prenotazione Utente**: Storico prenotazioni per utente
- **Residenza Più Popolare**: Statistiche di popolarità
- **Media Posti Letto**: Analisi delle capacità
- **Top Utenti Mensili**: Utenti con più giorni prenotati

### 3. Dashboard Interattiva

Homepage con overview completa:

- 📊 Statistiche aggregate (totale utenti, residenze, prenotazioni)
- 📈 Grafici e visualizzazioni
- 🔍 Accesso rapido alle operazioni CRUD
- 📱 Design responsive

## 🎨 Design System

### Stack UI

- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Componenti accessibili e personalizzabili
- **Lucide React**: Icone moderne e leggere
- **Sonner**: Toast notifications

### Palette Colori

```css
:root {
  --primary: 221.2 83.2% 53.3%;        /* Blue */
  --destructive: 0 84.2% 60.2%;        /* Red */
  --muted: 210 40% 96.1%;              /* Light gray */
  --accent: 210 40% 96.1%;             /* Accent color */
  --border: 214.3 31.8% 91.4%;         /* Border color */
}
```

### Componenti Principali

```tsx
// Buttons
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle</Button>

// Cards
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
  <CardFooter>{/* Actions */}</CardFooter>
</Card>

// Tables
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>

// Dialogs
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

## 🔄 Routing

### Struttura Routes

```tsx
<Routes>
  {/* Dashboard */}
  <Route path="/" element={<Layout />}>
    <Route index element={<Homepage {...props} />} />
  </Route>

  {/* CRUD Operations */}
  <Route path="/crud/" element={<Layout />}>
    <Route path="user" element={<UserManage />} />
    <Route path="host" element={<HostManage />} />
    <Route path="residence" element={<ResidenceManage />} />
    <Route path="booking" element={<BookingManage />} />
    <Route path="feedback" element={<FeedbackManage />} />
  </Route>

  {/* Custom Queries */}
  <Route path="/query/" element={<Layout />}>
    <Route path="residencesByHostCode" element={<ResidenceByHostCode />} />
    <Route path="lastUserBooking" element={<LastUserBooking users={users} />} />
    <Route path="mostPopularResidence" element={<MostPopularResidence />} />
    <Route path="topHostsThisMonth" element={<TopHosts />} />
    <Route path="superHosts" element={<SuperHosts />} />
    <Route path="topUsersThisMonth" element={<TopUsersMonthly />} />
    <Route path="averageBeds" element={<AvgBedsStats />} />
  </Route>
</Routes>
```

### Navigazione

```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const goToUsers = () => {
    navigate('/crud/user');
  };
}
```

## 📊 TypeScript Types

### Interfacce Principali

```typescript
// User
export interface User {
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  address: string;
  registrationDate: string;
}

// Host (extends User)
export interface Host {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  registrationDate: string;
  hostCode: string;
  totalBookings: number;
  isSuperHost: boolean;
}

// Residence
export interface Residence {
  id: number;
  name: string;
  address: string;
  price: number;
  numberOfRooms: number;
  guestCapacity: number;
  floor: number;
  availableFrom: string;
  availableTo: string;
  hostId: number;
  hostName: string;
  hostEmail: string;
  hostCode: string;
}

// Booking
export interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  residenceId: number;
  residenceName: string;
  residenceAddress: string;
  pricePerNight: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  hostId: number;
  hostName: string;
  hostEmail: string;
  hostCode: string;
  numberOfNights: number;
  totalPrice: number;
}

// Feedback
export interface Feedback {
  id: number;
  title: string;
  rating: number;
  comment: string;
  bookingId: number;
  bookingStartDate: string;
  bookingEndDate: string;
  residenceId: number;
  residenceName: string;
  residenceAddress: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}
```

### Validation Schema (Zod)

```typescript
import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  lastName: z.string().min(2, "Il cognome deve avere almeno 2 caratteri"),
  email: z.string().email("Inserisci un'email valida"),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
  address: z.string().min(5, "L'indirizzo è troppo breve"),
});

export type UserFormValues = z.infer<typeof userSchema>;
```

## 🌐 Comunicazione con Backend

### API Calls Pattern

```typescript
const API_URL = import.meta.env.VITE_API_URL;

// GET Request
const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    toast.error('Errore nel caricamento degli utenti');
  }
};

// POST Request
const createUser = async (userData: UserFormValues) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('Failed to create user');
    
    const newUser = await response.json();
    toast.success('Utente creato con successo');
    return newUser;
  } catch (error) {
    toast.error('Errore nella creazione');
    throw error;
  }
};

// DELETE Request
const deleteBooking = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/bookings/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete booking');
    
    toast.success('Prenotazione eliminata');
  } catch (error) {
    toast.error('Errore nell\'eliminazione');
  }
};
```

### Endpoints Utilizzati

```
# Users
GET    /api/v1/users
POST   /api/v1/users
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}
GET    /api/v1/users/stats/mdb

# Hosts
POST   /api/v1/hosts/{userId}
GET    /api/v1/hosts
GET    /api/v1/super_hosts
GET    /api/v1/stats/hosts

# Residences
GET    /api/v1/residences
POST   /api/v1/residence
PUT    /api/v1/residences/{id}
DELETE /api/v1/residences/{id}
GET    /api/v1/residences/owner/host_code/{code}
GET    /api/v1/residences/stats/mprlm
GET    /api/v1/residences/stats/avg

# Bookings
GET    /api/v1/bookings
POST   /api/v1/bookings
PUT    /api/v1/bookings/{id}
DELETE /api/v1/bookings/{id}
GET    /api/v1/bookings/user/{userId}/last

# Feedbacks
GET    /api/v1/feedbacks
POST   /api/v1/feedbacks
PUT    /api/v1/feedbacks/{id}
DELETE /api/v1/feedbacks/{id}
```

## 🎯 Pattern Architetturali

### Entity-Management Pattern

Ogni entità segue questo pattern standardizzato:

#### 1. Table Component

```tsx
// TableBooking.tsx
export function TableBooking({ bookings, onBookingDeleted }: TableBookingProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedBooking?.id) return;
    
    const res = await fetch(`${API_URL}/api/v1/bookings/${selectedBooking.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Booking deleted successfully");
      onBookingDeleted?.(selectedBooking.id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Table>
        {/* Table content */}
      </Table>
      
      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        {/* Dialog content */}
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        {/* Confirmation content */}
      </Dialog>
    </>
  );
}
```

#### 2. Create Form Component

```tsx
// CreateUserForm.tsx
export function CreateUserForm({ onUserCreated }: Props) {
  const [formData, setFormData] = useState<UserFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const newUser = await response.json();
        toast.success('User created successfully');
        onUserCreated?.(newUser);
        // Reset form
      }
    } catch (error) {
      toast.error('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Custom Query Pattern

```tsx
// TopHosts.tsx
export function TopHosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopHosts();
  }, []);

  const fetchTopHosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/stats/hosts`);
      const data = await response.json();
      setHosts(data);
    } catch (error) {
      toast.error('Error loading top hosts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="grid gap-4">
      {hosts.map(host => (
        <HostCard key={host.id} host={host} />
      ))}
    </div>
  );
}
```

## 📦 Dipendenze Principali

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "lucide-react": "^0.344.0",
    "sonner": "^1.4.0",
    "zod": "^3.22.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.0"
  }
}
```

## 🛠️ Scripts NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

### Comandi

```bash
pnpm dev          # Avvia dev server
pnpm build        # Build per produzione
pnpm preview      # Preview build locale
pnpm lint         # Esegui linting
pnpm type-check   # Verifica TypeScript
```

## 🚀 Build e Deploy

### Build per Produzione

```bash
# Type check
pnpm type-check

# Build
pnpm build

# Preview build
pnpm preview
```

I file di build saranno generati nella cartella `dist/`

### Deployment

```bash
# Deploy su servizio statico (Vercel, Netlify, etc.)
pnpm build

# I file in dist/ sono pronti per essere serviti
```

### Variabili d'Ambiente per Produzione

```env
VITE_API_URL=https://your-production-api.com
```

## 🎨 Personalizzazione UI

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
    },
  },
  plugins: [],
}
```

## 📱 Responsive Design

L'applicazione è completamente responsive:

- **Mobile**: Layout single-column, navigation drawer
- **Tablet**: Grid 2-column, sidebar collapsible
- **Desktop**: Full grid layout, fixed sidebar

```tsx
// Esempio responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Esempio visibilità condizionale
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache e reinstalla
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf .vite
pnpm dev
```

### TypeScript Errors

```bash
# Verifica types
pnpm type-check

# Aggiorna types
pnpm add -D @types/react@latest @types/react-dom@latest
```

### API Connection Issues

```bash
# Verifica che il backend sia in esecuzione
curl http://localhost:8080/api/v1/users

# Controlla la variabile d'ambiente
echo $VITE_API_URL
```

## 📝 Best Practices

✅ **Sempre tipizzare** con TypeScript  
✅ **Validare input** con Zod  
✅ **Gestire errori** con try-catch e toast  
✅ **Componenti piccoli** e riutilizzabili  
✅ **State locale** per dati non condivisi  
✅ **Naming consistente** (PascalCase per componenti, camelCase per funzioni)  
✅ **Accessibilità** (ARIA labels, keyboard navigation)  

## 📞 Supporto

Per problemi o domande:
- Verifica la console del browser per errori
- Controlla che il backend sia raggiungibile
- Verifica le variabili d'ambiente

---

**Versione**: 1.0  
**React**: 18+  
**TypeScript**: 5+  
**Vite**: 5+  
**Ultimo aggiornamento**: Febbraio 2026  
**Autore**: Giuseppe Tesse