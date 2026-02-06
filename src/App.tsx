import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import { useEffect, useState } from "react";
import { toast } from 'sonner'
import Layout from "./components/common/layout"
import ResidenceByHostCode from "./utils/ResidencesByHostCode";
import LastUserBooking from "./utils/LastUserBooking";
import UserManage from "./pages/user";
import HostManage from "./pages/host";
import ResidenceManage from "./pages/residences";
import BookingManage from "./pages/booking";
import FeedbackManage from "./pages/feedback";
import MostPopularResidence from "./utils/MostPopularResidence";
import TopHosts from "./utils/MostPopularHosts";
import SuperHosts from "./utils/AllSuperHosts";
import TopUsersMonthly from "./utils/TopUsersDayBooking";


export function App() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [usersCount, setUsersCount] = useState<number>(0);
  const [hostsCount, setHostsCount] = useState<number>(0);
  const [residencesCount, setResidencesCount] = useState<number>(0);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [feedbacksCount, setFeedbacksCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, hostsRes, residencesRes, bookingsRes, feedbacksRes] =
          await Promise.all([
            fetch(`${API_URL}/api/v1/users/stats/count`),
            fetch(`${API_URL}/api/v1/hosts/stats/count`),
            fetch(`${API_URL}/api/v1/residences/stats/count`),
            fetch(`${API_URL}/api/v1/bookings/stats/count`),
            fetch(`${API_URL}/api/v1/feedbacks/stats/count`)
          ]);

        if (!usersRes.ok || !hostsRes.ok || !residencesRes.ok ||
          !bookingsRes.ok || !feedbacksRes.ok) {
          throw new Error('Errore nel caricamento dei dati');
        }

        const [usersCountData, hostsCountData, residencesCountData, bookingsCountData, feedbacksCountData] =
          await Promise.all([
            usersRes.json(),
            hostsRes.json(),
            residencesRes.json(),
            bookingsRes.json(),
            feedbacksRes.json()
          ]);

        setUsersCount(usersCountData);
        setHostsCount(hostsCountData);
        setResidencesCount(residencesCountData);
        setBookingsCount(bookingsCountData);
        setFeedbacksCount(feedbacksCountData);

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
              users={usersCount}
              hosts={hostsCount}
              residences={residencesCount}
              bookings={bookingsCount}
              feedbacks={feedbacksCount}
            />
          }
        />
      </Route>
      <Route path="/query/" element={<Layout />}>
        <Route path="residencesByHostCode/:hostCode?" element={<ResidenceByHostCode />} />
        <Route path="lastUserBooking" element={<LastUserBooking />} />
        <Route path="mostPopularResidence" element={<MostPopularResidence />} />
        <Route path="topHostsThisMonth" element={<TopHosts />} />
        <Route path="superHosts" element={<SuperHosts />} />
        <Route path="topUsersThisMonth" element={<TopUsersMonthly />} />
      </Route>
      <Route path="/crud/" element={<Layout />}>
        <Route path="user" element={<UserManage />} />
        <Route path="host" element={<HostManage />} />
        <Route path="residence" element={<ResidenceManage />} />
        <Route path="booking" element={<BookingManage />} />
        <Route path="feedback" element={<FeedbackManage />} />
      </Route>
    </Routes>

  )
}

export default App;