import { RouterProvider, createBrowserRouter } from 'react-router-dom';


import EditEventPage from './pages/EditEvent';
import ErrorPage from './pages/Error';
import EventDetailPage, {
  loader as eventDetailLoader,
  action as deleteEventAction,
} from './pages/EventDetail';
import EventsPage, { loader as eventsLoader } from './pages/Events';
import EventsRootLayout from './pages/EventsRoot';
import HomePage from './pages/Home';
import NewEventPage from './pages/NewEvent';
import RootLayout from './pages/Root';
import { action as manipulateEventAction } from './components/EventForm';
import NewsletterPage, { action as newsletterAction } from './pages/Newsletter';
import AuthenticationPage from './pages/Authentication';
import { tokenLoader, checkAuthLoader } from './util/auth';
import { action as logoutAction } from './pages/Logout';
import DesignationPage from './pages/Designation';
import DoctorPage from './pages/Doctor';
import HospitalPage from './pages/Hospital';
import ZonePage from './pages/Zone';
import StatePage from './pages/State';
import RegionPage from './pages/Region';
import SpecialityPage from './pages/Speciality';
import EmployeePage from './pages/Employee';
import EmployeeDetailPage from './pages/EmployeeDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticationPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/dashboard',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'designation', element: <DesignationPage /> },
      { path: 'doctor', element: <DoctorPage /> },
      { path: 'hospital', element: <HospitalPage /> },
      { path: 'zone', element: <ZonePage /> },
      { path: 'state', element: <StatePage /> },
      { path: 'region', element: <RegionPage /> },
      { path: 'specility', element: <SpecialityPage /> },
      {
        path: 'employee',
        element: <EmployeePage />,
      },
      {
        path: 'employee/:empId',
        element: <EmployeeDetailPage />
      }
      // {
      //   path: 'events',
      //   element: <EventsRootLayout />,
      //   children: [
      //     {
      //       index: true,
      //       element: <EventsPage />,
      //       loader: eventsLoader,
      //     },
      //     {
      //       path: ':eventId',
      //       id: 'event-detail',
      //       loader: eventDetailLoader,
      //       children: [
      //         {
      //           index: true,
      //           element: <EventDetailPage />,
      //           action: deleteEventAction,
      //         },
      //         {
      //           path: 'edit',
      //           element: <EditEventPage />,
      //           action: manipulateEventAction,
      //           loader: checkAuthLoader
      //         },
      //       ],
      //     },
      //     {
      //       path: 'new',
      //       element: <NewEventPage />,
      //       action: manipulateEventAction,
      //       loader: checkAuthLoader
      //     },
      //   ],
      // },
      // {
      //   path: 'auth',
      //   element: <AuthenticationPage />
      // },
      // {
      //   path: 'newsletter',
      //   element: <NewsletterPage />,
      //   action: newsletterAction,
      // },
    ],
  },
  {
    path: 'logout',
    action: logoutAction
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />;
    </>
  )
}

export default App;
