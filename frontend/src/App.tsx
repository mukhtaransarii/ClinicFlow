import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Dashboard from "@/pages/dashboard/Dashboard";
import Doctors from "@/pages/doctors/Doctors";
import Patients from "@/pages/patients/Patients";
import Appointments from "@/pages/appointments/Appointments";
import Calendar from "@/pages/calendar/Calendar";
import Settings from "@/pages/settings/Settings";
import Notifications from "@/pages/notifications/Notifications";
import Schedules from "@/pages/schedules/Schedules";
import Booking from "@/pages/booking/Booking";
export default function App() {
    const loadMe = useAuthStore((state) => state.loadMe);
    useEffect(() => {
        loadMe();
    }, [loadMe]);
    return (<Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/booking/:clinicSlug" element={<Booking />}/>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/appointments" element={<Appointments />}/>
          <Route path="/calendar" element={<Calendar />}/>
          <Route path="/doctors" element={<Doctors />}/>
          <Route path="/patients" element={<Patients />}/>
          <Route path="/notifications" element={<Notifications />}/>
          <Route path="/schedules" element={<Schedules />}/>
          <Route path="/settings" element={<Settings />}/>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>);
}

