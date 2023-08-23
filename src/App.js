import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import RootLayout from './pages/Root';
import AuthenticationPage from './pages/Authentication';
import { tokenLoader } from './util/auth';
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
import MedicineUsagePage from './pages/MedicineUsage';

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
      { path: 'employee', element: <EmployeePage /> },
      { path: 'employee/:empId', element: <EmployeeDetailPage /> },
      { path: 'medicineusage', element: <MedicineUsagePage /> }
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
      <RouterProvider router={router} />
    </>
  )
}

export default App;
