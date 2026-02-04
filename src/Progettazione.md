# Progettazione Frontend - Residence Manager

## 📋 Indice

1. [Panoramica del Progetto](#panoramica-del-progetto)
2. [Stack Tecnologico](#stack-tecnologico)
3. [Architettura del Sistema](#architettura-del-sistema)
4. [Struttura delle Cartelle](#struttura-delle-cartelle)
5. [Pattern Architetturali](#pattern-architetturali)
6. [Componenti Principali](#componenti-principali)
7. [Gestione dello Stato](#gestione-dello-stato)
8. [Sistema di Routing](#sistema-di-routing)
9. [Comunicazione con il Backend](#comunicazione-con-il-backend)
10. [Design System](#design-system)
11. [Tipizzazione TypeScript](#tipizzazione-typescript)
12. [Best Practices e Convenzioni](#best-practices-e-convenzioni)

---

## 1. Panoramica del Progetto

**Residence Manager** è un'applicazione web per la gestione completa di residenze turistiche. Il frontend offre un'interfaccia intuitiva per amministrare:

- **Utenti**: Gestione di ospiti e proprietari
- **Residenze**: Catalogo delle proprietà disponibili
- **Prenotazioni**: Sistema di booking con tracciamento dello stato
- **Feedback**: Raccolta e visualizzazione delle recensioni

L'applicazione è progettata seguendo i principi di **modularità**, **scalabilità** e **manutenibilità**, con particolare attenzione all'esperienza utente e alle performance.

---

## 2. Stack Tecnologico

### Core Framework
- **React 18+**: Libreria UI con hooks moderni
- **TypeScript**: Type-safety e autocompletamento
- **Vite**: Build tool veloce e ottimizzato

### Styling e UI
- **Tailwind CSS**: Framework utility-first per styling rapido
- **Shadcn/UI**: Componenti accessibili e personalizzabili
- **Lucide React**: Libreria di icone moderne e leggere

### Routing e Stato
- **React Router DOM**: Navigazione client-side
- **useState/useEffect**: State management locale

### Feedback Utente
- **Sonner**: Sistema di notifiche toast elegante

### Ambiente di Sviluppo
- **ESLint**: Linting del codice
- **TypeScript ESLint**: Regole specifiche per TS

---

## 3. Architettura del Sistema

### 3.1 Architettura a Layer

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Pages - Orchestration)          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        Component Layer              │
│  (Entity Components + Common)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         UI Component Layer          │
│      (Shadcn/UI Primitives)         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Data Layer                  │
│    (API Calls + Types)              │
└─────────────────────────────────────┘
```

### 3.2 Principi Architetturali

1. **Separation of Concerns**: Ogni layer ha responsabilità ben definite
2. **Component Composition**: Composizione di componenti piccoli e riutilizzabili
3. **Single Source of Truth**: Tipizzazione centralizzata in `types/index.ts`
4. **DRY (Don't Repeat Yourself)**: Logica comune centralizzata in `common/`

---

## 4. Struttura delle Cartelle

```
src/
├── components/              # Componenti organizzati per dominio
│   ├── booking/            # Dominio Prenotazioni
│   │   ├── TableBooking.tsx
│   │   └── CreateBookingForm.tsx
│   │
│   ├── feedback/           # Dominio Recensioni
│   │   ├── TableFeedback.tsx
│   │   └── CreateFeedbackForm.tsx
│   │
│   ├── residence/          # Dominio Residenze
│   │   ├── TableResidence.tsx
│   │   └── CreateResidenceForm.tsx
│   │
│   ├── user/               # Dominio Utenti
│   │   ├── TableUser.tsx
│   │   └── CreateUserForm.tsx
│   │
│   ├── common/             # Componenti trasversali
│   │   ├── buttonManage.tsx  # CRUD Operations
│   │   │
│   │   ├── buttonOp/.tsx     # Custom Queries
│   │   │
│   │   ├── layout.tsx       # Layout components
│   │   │
│   │   └── cards.tsx         # Card informative
│   │
│   └── ui/                 # Shadcn/UI primitives
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── table.tsx
│       └── ...
│
├── pages/                  # Pagine applicazione
│   ├── Home.tsx           # Dashboard principale
│   ├── UserPage.tsx       # Gestione utenti
│   ├── ResidencePage.tsx  # Gestione residenze
│   ├── BookingPage.tsx    # Gestione prenotazioni
│   └── FeedbackPage.tsx   # Gestione feedback
│
├── types/                  # TypeScript definitions
│   └── index.ts           # Interfacce centralizzate
│
├── utils/                  # Utility functions
│   └── queryCustom.tsx    # Componenti statistiche
│
├── hooks/                  # Custom React hooks
│   ├── useApi.ts          # Hook per chiamate API
│   └── useDebounce.ts     # Hook utility
│
├── config/                 # Configurazioni
│   └── constants.ts       # Costanti applicazione
│
├── App.tsx                 # Root component + Router
├── main.tsx                # Entry point
└── index.css               # Global styles
```

### 4.1 Logica di Organizzazione

#### Domain-Driven Structure
I componenti sono organizzati per **dominio di business** (booking, feedback, residence, user) per:
- Facilitare la navigazione del codice
- Permettere modifiche isolate per entità
- Scalare facilmente aggiungendo nuovi domini

#### Common Components
La cartella `common/` contiene componenti **cross-domain** che:
- Implementano pattern ripetuti (CRUD operations)
- Forniscono layout condivisi
- Gestiscono operazioni trasversali

---

## 5. Pattern Architetturali

### 5.1 Entity-Management Pattern

Ogni entità segue un pattern standardizzato composto da tre elementi principali:

#### **A) Form di Creazione**
```tsx
// CreateBookingForm.tsx
export function CreateBookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({...});
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Prenotazione creata con successo');
        // Reset form e aggiorna lista
      }
    } catch (error) {
      toast.error('Errore nella creazione');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields con validazione */}
    </form>
  );
}
```

#### **B) Tabella Visualizzazione**
```tsx
// TableBooking.tsx
export function TableBooking({ 
  bookings, 
  onBookingDeleted 
}: TableBookingProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const API_URL = import.meta.env.VITE_API_URL


  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setDetailDialogOpen(true)
  }

  
  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSubmit = async () => {
    if (!selectedBooking || !selectedBooking.id) return

    try {
      const res = await fetch(`${API_URL}/api/v1/bookings/${selectedBooking.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete booking")

      toast.success("Booking deleted successfully")
      if (onBookingDeleted) onBookingDeleted(selectedBooking.id)
      setDeleteDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error deleting booking")
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Residence</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Check-in / Out</TableHead>
            <TableHead>Nights</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-1">
                    <HomeIcon className="size-3" /> {b.residenceName}
                  </span>
                  <span className="text-xs text-muted-foreground">{b.residenceAddress}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="flex items-center gap-1">
                    <UserIcon className="size-3" /> {b.userFirstName} {b.userLastName}
                  </span>
                  <span className="text-xs text-muted-foreground">{b.userEmail}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs">
                <div>In: {formatDate(b.startDate)}</div>
                <div>Out: {formatDate(b.endDate)}</div>
              </TableCell>
              <TableCell>{b.numberOfNights}</TableCell>
              <TableCell className="font-bold text-green-600">
                ${b.totalPrice?.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(b)}>
                      <InfoIcon className="mr-2 size-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive font-semibold"
                      onClick={() => handleDeleteClick(b)}
                    >
                      Cancel Booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDaysIcon className="size-5 text-primary" /> Booking Summary
            </DialogTitle>
            <DialogDescription>
              Full details for reservation #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase pt-1">Residence</Label>
                <div className="col-span-3 font-medium">
                  {selectedBooking.residenceName}
                  <p className="text-xs text-muted-foreground font-normal">{selectedBooking.residenceAddress}</p>
                </div>
              </div>
              
              <Separator />

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase pt-1">Guest</Label>
                <div className="col-span-3 font-medium">
                  {selectedBooking.userFirstName} {selectedBooking.userLastName}
                  <p className="text-xs text-muted-foreground font-normal">{selectedBooking.userEmail}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase pt-1">Stay</Label>
                <div className="col-span-3">
                  <div className="flex justify-between mb-1">
                    <span>Check-in:</span>
                    <span className="font-medium">{formatDate(selectedBooking.startDate)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Check-out:</span>
                    <span className="font-medium">{formatDate(selectedBooking.endDate)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-dashed mt-1">
                    <span>Nights:</span>
                    <span className="font-medium">{selectedBooking.numberOfNights}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase">Host</Label>
                <div className="col-span-3 italic text-muted-foreground">
                  {selectedBooking.hostName} ({selectedBooking.hostCode})
                </div>
              </div>

              <div className="mt-2 p-3 bg-muted rounded-md flex justify-between items-center">
                <span className="font-semibold">Total Price</span>
                <span className="text-lg font-bold text-primary">${selectedBooking.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This will permanently remove the reservation for 
              <strong> {selectedBooking?.userFirstName} {selectedBooking?.userLastName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

#### **C) Dialog di Modifica**
```tsx
// EditBookingDialog.tsx
export function EditBookingDialog({ 
  booking, 
  open, 
  onOpenChange, 
  onSuccess 
}: Props) {
  const [formData, setFormData] = useState(booking);
  
  const handleUpdate = async () => {
    const response = await fetch(`${API_URL}/bookings/${booking.id}`, {
      method: 'PUT',
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      toast.success('Prenotazione aggiornata');
      onSuccess();
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Form di modifica */}
    </Dialog>
  );
}
```

### 5.2 Button Component Pattern

#### **A) CRUD Buttons (buttonManage/)**

**ButtonCreate**
```tsx
export function ButtonCreate({ 
  entity, 
  FormComponent, 
  onSuccess 
}: Props) {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crea {entity}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <FormComponent onSuccess={() => {
          onSuccess();
          setOpen(false);
        }} />
      </DialogContent>
    </Dialog>
  );
}
```

**ButtonDelete**
```tsx
export function ButtonDelete({ 
  id, 
  entity, 
  endpoint, 
  onSuccess 
}: Props) {
  const handleDelete = async () => {
    if (!confirm(`Eliminare ${entity}?`)) return;
    
    const response = await fetch(`${API_URL}${endpoint}/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      toast.success(`${entity} eliminato`);
      onSuccess();
    }
  };
  
  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
```

#### **B) Operation Buttons (buttonOp/)**

```tsx
// ButtonStats.tsx
export function ButtonStats({ 
  endpoint, 
  label, 
  icon: Icon 
}: Props) {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    // Trigger statistiche o export
    setLoading(false);
  };
  
  return (
    <Button onClick={handleClick} disabled={loading}>
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
```

### 5.3 Custom Query Pattern

I componenti in `utils/queryCustom.tsx` seguono questo pattern:

```tsx
// TopHostsCard.tsx
export function TopHostsCard() {
  const [data, setData] = useState<HostStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTopHosts();
  }, []);
  
  const fetchTopHosts = async () => {
    try {
      const response = await fetch(`${API_URL}/stats/top-hosts`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorCard message={error} />;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Hosts</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map(host => (
          <div key={host.id}>
            {/* Visualizzazione dati */}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

**Vantaggi**:
- **Autonomo**: Gestisce il proprio stato
- **Riusabile**: Può essere inserito in qualsiasi pagina
- **Isolato**: Errori non propagano ad altri componenti

---

## 6. Componenti Principali

### 6.1 Pages (Orchestratori)

Le pagine coordinano i componenti entity-specific:

```tsx
// UserPage.tsx
export function UserPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestione Utenti</h1>
        <ButtonCreate 
          entity="Utente"
          FormComponent={CreateUserForm}
          onSuccess={handleRefresh}
        />
      </div>
      
      <TableUser key={refreshKey} />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserStatsCard />
        <RecentUsersCard />
      </div>
    </div>
  );
}
```

### 6.2 Layout Components

#### Navbar
```tsx
export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Logo />
        <nav className="ml-auto flex gap-4">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/users">Utenti</NavLink>
          <NavLink to="/residences">Residenze</NavLink>
          <NavLink to="/bookings">Prenotazioni</NavLink>
        </nav>
        <UserMenu />
      </div>
    </header>
  );
}
```


### 6.3 Common Cards

```tsx
// StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}% dal mese scorso
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 7. Gestione dello Stato

### 7.1 State Management Strategy

Il progetto utilizza **state locale** con `useState` e `useEffect`, evitando complessità non necessarie:

#### **Perché Locale?**
- ✅ Applicazione di dimensioni medie
- ✅ Dati non condivisi tra molte route
- ✅ Semplicità e manutenibilità
- ✅ Performance adeguate

#### **Pattern di Refresh**
```tsx
// Parent component
const [refreshKey, setRefreshKey] = useState(0);

const triggerRefresh = () => {
  setRefreshKey(prev => prev + 1);
};

// Passa il callback ai children
<TableComponent key={refreshKey} />
<CreateButton onSuccess={triggerRefresh} />
```

### 7.2 Stati Comuni

```tsx
// Loading State
const [loading, setLoading] = useState(true);

// UI State
const [dialogOpen, setDialogOpen] = useState(false);
```

## 8. Sistema di Routing

### 8.1 Configurazione Router

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Homepage
              users={users}
              hosts={hosts}
              residences={residences}
              bookings={bookings}
              feedbacks={feedbacks}
            />
          }
        />
      </Route>
      <Route path="/query/" element={<Layout />}>
        <Route path="residencesByHostCode" element={<ResidenceByHostCode />} />
        <Route path="lastUserBooking" element={<LastUserBooking users={users} />} />
        <Route path="mostPopularResidence" element={<MostPopularResidence />} />
        <Route path="topHostsThisMonth" element={<TopHosts />} />
        <Route path="superHosts" element={<SuperHosts />} />
        <Route path="topUsersThisMonth" element={<TopUsersMonthly />} />
        <Route path="averageBeds" element={<AvgBedsStats />} />
      </Route>
      <Route path="/crud/" element={<Layout />}>
        <Route path="user" element={<UserManage />} />
        <Route path="host" element={<HostManage />} />
        <Route path="residence" element={<ResidenceManage/>} />
        <Route path="booking" element={<BookingManage/>} />
        <Route path="feedback" element={<FeedbackManage/>} />
      </Route>
    </Routes>

  )
}
```
---

## 9. Comunicazione con il Backend

### 9.1 Configurazione API

```tsx
// config/constants.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

```env
# .env
VITE_API_URL=http://localhost:8080/api
```

### 9.2 Pattern di Chiamata API

#### **GET Request**
```tsx
const fetchData = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    
    if (!response.ok) {
      throw new Error('Errore nel caricamento');
    }
    
    const data = await response.json();
    setUsers(data);
  } catch (error) {
    console.error(error);
    toast.error('Impossibile caricare i dati');
  }
};
```

#### **POST Request**
```tsx
const createUser = async (userData: UserFormData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Errore nella creazione');
    }
    
    const newUser = await response.json();
    toast.success('Utente creato con successo');
    return newUser;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
};
```

#### **PUT Request**
```tsx
const updateUser = async (id: number, userData: UserFormData) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (response.ok) {
    toast.success('Utente aggiornato');
  }
};
```

#### **DELETE Request**
```tsx
const deleteUser = async (id: number) => {
  if (!confirm('Sei sicuro di voler eliminare questo utente?')) {
    return;
  }
  
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE'
  });
  
  if (response.ok) {
    toast.success('Utente eliminato');
    refetchUsers();
  }
};
```

### 9.3 Error Handling

```tsx
const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('Si è verificato un errore imprevisto');
  }
  
  console.error('API Error:', error);
};
```

---

## 10. Design System

### 10.1 Palette Colori

```css
/* Tailwind Config */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}
```

### 10.2 Tipografia

```tsx
// Gerarchia testuale
<h1 className="text-4xl font-bold">Titolo Principale</h1>
<h2 className="text-3xl font-semibold">Sottotitolo</h2>
<h3 className="text-2xl font-medium">Sezione</h3>
<p className="text-base text-muted-foreground">Corpo del testo</p>

// Dati numerici
<span className="text-5xl font-bold tracking-tight">1,234</span>

// Codici identificativi
<code className="font-mono text-sm bg-muted px-2 py-1 rounded">USR-001</code>
```

### 10.3 Spacing e Layout

```tsx
// Container principale
<div className="container mx-auto px-4 py-6">

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flex layouts
<div className="flex items-center justify-between gap-4">

// Spacing consistente
<div className="space-y-4">  {/* Vertical spacing */}
<div className="space-x-2">  {/* Horizontal spacing */}
```

### 10.4 Componenti UI Base

#### Button Variants
```tsx
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>
```

#### Card Structure
```tsx
<Card>
  <CardHeader>
    <CardTitle>Titolo Card</CardTitle>
    <CardDescription>Descrizione opzionale</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Contenuto principale */}
  </CardContent>
  <CardFooter>
    {/* Azioni */}
  </CardFooter>
</Card>
```

#### Table Structure
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
      <TableHead className="text-right">Azioni</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell className="text-right">
          {/* Buttons */}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 10.5 Responsive Design

```tsx
// Mobile-first approach
<div className="
  w-full                  // Mobile
  md:w-1/2               // Tablet
  lg:w-1/3               // Desktop
  xl:w-1/4               // Large desktop
">

// Nascondere elementi
<div className="hidden md:block">  {/* Visibile solo da tablet in su */}
<div className="block md:hidden">  {/* Visibile solo su mobile */}
```

---

## 11. Tipizzazione TypeScript

### 11.1 Interfacce Principali

```tsx

import { z } from "zod"

export interface User{
    userId: number,
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    address: string,
    registrationDate: string
}

export interface Host{
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    address: string,
    registrationDate: string,
    hostCode: string,
    totalBookings: number,
    isSuperHost: boolean
}


export interface Residence{
    id: number,
    name: string,
    address: string,
    price: number,
    numberOfRooms: number,
    guestCapacity: number,
    floor: number,
    availableFrom: string,
    availableTo: string,
    hostId: number,
    hostName: string,
    hostEmail: string,
    hostCode: string
}

export interface Booking{
    id: number,
    startDate: string,
    endDate: string,
    residenceId: number,
    residenceName: string,
    residenceAddress: string,
    pricePerNight: number,
    userId: number,
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    hostId: number,
    hostName: string,
    hostEmail: string,
    hostCode: string
    numberOfNights: number,
    totalPrice: number
}

export interface Feedback{
    id:	number,
    title:	string,
    rating:	number,
    comment:	string,
    bookingId:	number,
    bookingStartDate:	string,
    bookingEndDate:	string,
    residenceId: number,
    residenceName: string,
    residenceAddress: string,
    userId: number,
    userFirstName: string,
    userLastName: string,
    userEmail: string,
}

export type ColorType = 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'red';



export const userSchema = z.object({
  firstName: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  lastName: z.string().min(2, "Il cognome deve avere almeno 2 caratteri"),
  email: z.string().email("Inserisci un'email valida"),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
  address: z.string().min(5, "L'indirizzo è troppo breve"),
})

export type UserFormValues = z.infer<typeof userSchema>

export interface TableBookingProps {
  bookings: Booking[];
  onBookingUpdated?: (updated: Booking) => void;
  onBookingDeleted?: (id: number) => void;
}

export interface PromoteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserPromoted: (newHost: Host) => void
  existingHosts: Host[]
}

export interface TableHostProps {
  hosts: Host[]
  onHostsChange: (hosts: Host[]) => void
}

export interface TableResidenceProps {
  residences: Residence[];
  onResidenceUpdated?: (updated: Residence) => void; 
  onResidenceDeleted?: (id: number) => void;        
}

export interface TableUserProps {
  users: User[]
  onUserUpdated?: (user: User) => void
  onUserDeleted?: (userId: number) => void
}

export interface TopUserStats {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  totalDays: number;
}

export interface AvgBedsResponse {
  avgnumberOfBeds: number;
}

```

## 12. Best Practices e Convenzioni

### 12.1 Naming Conventions

#### File e Componenti
```
✅ PascalCase per componenti: UserPage.tsx, TableBooking.tsx
✅ camelCase per utilities: formatDate.ts, apiHelper.ts
✅ kebab-case per CSS: custom-styles.css
```

#### Variabili e Funzioni
```tsx
// State variables - descrittivi
const [users, setUsers] = useState<User[]>([]);
const [isLoading, setIsLoading] = useState(false);

// Handlers - prefisso "handle"
const handleSubmit = () => {};
const handleDelete = () => {};
const handleInputChange = () => {};

// Fetch functions - prefisso "fetch"
const fetchUsers = async () => {};
const fetchBookings = async () => {};
```

### 12.2 Organizzazione Imports

```tsx
// 1. React imports
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. External libraries
import { toast } from 'sonner';
import { Trash2, Edit, Plus } from 'lucide-react';

// 3. Internal components
import { Button } from '@/components/ui/button';
import { TableUser } from '@/components/user/TableUser';

// 4. Types
import type { User, UserFormData } from '@/types';

// 5. Utils e constants
import { API_URL } from '@/config/constants';
import { formatDate } from '@/utils/formatters';
```

### 12.3 Component Structure

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';

// 2. Types/Interfaces (se specifiche del componente)
interface UserCardProps {
  user: User;
  onEdit: () => void;
}

// 3. Component
export function UserCard({ user, onEdit }: UserCardProps) {
  // 3.1 Hooks
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 3.2 Handlers
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  
  // 3.3 Early returns
  if (!user) return null;
  
  // 3.4 Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 4. Export (se non fatto inline)
```

### 12.4 Error Handling

```tsx
// Try-catch per async operations
const fetchData = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    toast.error('Errore nel caricamento dei dati');
    return null;
  }
};

// Error boundaries per componenti critici
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 12.5 Environment Variables

```tsx
// ✅ Sempre usa fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ✅ Valida le variabili critiche
if (!import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL non configurata, usando default');
}

// ✅ Centralizza in un config file
// config/env.ts
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV
};
```

---

## 📚 Appendice

### A. Checklist Pre-Deploy

```markdown
- [ ] Build senza errori (`npm run build`)
- [ ] TypeScript check passa (`npm run type-check`)
- [ ] Lint pulito (`npm run lint`)
- [ ] Variabili d'ambiente configurate
- [ ] API URL corretta per produzione
- [ ] Assets ottimizzati
- [ ] Meta tags SEO configurati
- [ ] Favicon presente
- [ ] Error boundaries implementate
- [ ] Loading states gestiti
- [ ] 404 page presente
```

### B. Script Utili

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""
  }
}
```

### C. Risorse Utili

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Documento versione**: 1.0  
**Ultimo aggiornamento**: Febbraio 2026  
**Autore**: Giuseppe Tesse