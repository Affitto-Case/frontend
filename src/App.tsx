import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import { useEffect, useState } from "react";
import { type User, type Booking, type Feedback, type Host, type Residence } from "./types";
import { toast } from 'sonner'
import Layout from "./components/common/layout"
import ResidenceByHostCode from "./utils/ResidencesByHostCode";


export function App() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [users,setUsers] = useState<User[]>([]);
    const [hosts,setHosts] = useState<Host[]>([]);
    const [residences,setResidences] = useState<Residence[]>([]);
    const [bookings,setBookings] = useState<Booking[]>([]);
    const [feedbacks,setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, hostsRes, residencesRes, bookingsRes, feedbacksRes] = 
        await Promise.all([
          fetch(`${API_URL}/api/v1/users`),
          fetch(`${API_URL}/api/v1/hosts`),
          fetch(`${API_URL}/api/v1/residences`),
          fetch(`${API_URL}/api/v1/bookings`),
          fetch(`${API_URL}/api/v1/feedbacks`)
        ]);

      if (!usersRes.ok || !hostsRes.ok || !residencesRes.ok || 
          !bookingsRes.ok || !feedbacksRes.ok) {
        throw new Error('Errore nel caricamento dei dati');
      }

      const [users, hosts, residences, bookings, feedbacks] = 
        await Promise.all([
          usersRes.json(),
          hostsRes.json(),
          residencesRes.json(),
          bookingsRes.json(),
          feedbacksRes.json()
        ]);

      setUsers(users);
      setHosts(hosts);
      setResidences(residences);
      setBookings(bookings);
      setFeedbacks(feedbacks);

      toast.success("Data loaded successfully");

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  loadAllData();
}, []);



if (isLoading) {
  return <div>Caricamento...</div>;
}

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
    <Route path="residencesByHostCode" element={<ResidenceByHostCode />} />
    {/* <Route path="lastUserBooking" element={<LastUserBooking />} />
    <Route path="mostPopularResidence" element={<MostPopularResidence />} />
    <Route path="topHostsThisMonth" element={<TopHostsThisMonth />} />
    <Route path="superHosts" element={<SuperHosts />} />
    <Route path="topUsersThisMonth" element={<TopUsersThisMonth />} />
    <Route path="averageBeds" element={<AverageBeds />} /> */}
  </Route>
</Routes>

)
}

export default App;