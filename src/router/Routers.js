import React from 'react';
import ProtectedRoute from '../config/ProtectedRoute';
import Bookings from '../pages/Bookings';
import BookingDetail from '../pages/BookingDetail';
import AdminDashboard from '../pages/AdminDashboard';
import CreateBooking from '../pages/CreateBooking';
import Tasks from '../pages/Tasks';
import TaskDetail from '../pages/TaskDetail';
import Dashboard from '../pages/Dashboard';


const Home = React.lazy(() => import('../pages/Home'));
const About = React.lazy(() => import('../pages/About'));
const Contact = React.lazy(() => import('../pages/Contact'));

const routes = [
  { path: '/', exact: true, name: 'Home', element: <Home /> },
  { path: '/about', exact: false, name: 'About', element: <About /> },
  { path: '/contact', exact: false, name: 'Contact', element: <Contact /> },
  { path: '/admin-dashboard', exact: false, name: 'Dashboard', element: <ProtectedRoute><AdminDashboard/></ProtectedRoute>},
  { path: '/dashboard', exact: false, name: 'Dashboard', element: <ProtectedRoute><Dashboard/></ProtectedRoute>},
  { path: '/create-booking', exact: false, name: 'Dashboard', element: <ProtectedRoute><CreateBooking/></ProtectedRoute>},
  { path: '/bookings', exact: true, name: 'Bookings', element: <ProtectedRoute><Bookings /></ProtectedRoute> },
  { path: '/tasks', exact: true, name: 'Bookings', element: <ProtectedRoute><Tasks /></ProtectedRoute> },
  { 
    path: '/bookings/:bookingId', 
    exact: true, 
    name: 'BookingDetail', 
    element: <ProtectedRoute><BookingDetail /></ProtectedRoute>
  },
  { 
    path: '/tasks/:bookingId', 
    exact: true, 
    name: 'TaskDetail', 
    element: <ProtectedRoute><TaskDetail /></ProtectedRoute>
  },
];

export default routes;