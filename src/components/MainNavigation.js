import { useRouteLoaderData, Form } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from "react-router-dom";


function MainNavigation() {

  const navigate = useNavigate();

  const items = [
    {
      label: 'Doctor',
      command: () => { navigate('/dashboard/doctor') }
    },
    {
      label: 'Employee',
      command: () => { navigate('/dashboard/employee') }
    },

    {
      label: 'MedicineUsage',
      command: () => { navigate('/dashboard/medicineusage') }
    },

    {
      label: 'Master',
      items: [
        { label: 'Designation', command: () => { navigate('/dashboard/designation') } },
        { label: 'Zone', command: () => { navigate('/dashboard/zone') } },
        { label: 'State', command: () => { navigate('/dashboard/state') } },
        { label: 'Region', command: () => { navigate('/dashboard/region') } },
        { label: 'speciality', command: () => { navigate('/dashboard/specility') } }
      ]
    }
  ];

  //const start = (<img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2" />)
  const start = (<img alt="logo" src={process.env.PUBLIC_URL + '/logo.svg'} height="40" className="mr-2" />)

  const end = (
    <>
      <ul className="list-inline list-inline-right">
        <li className="list-inline-item">
          <Form action='/logout' method='post'>
            <button><span>Admin </span><i className="pi pi-fw pi-power-off" style={{ color: '#fff' }}></i></button>
          </Form>
        </li>
      </ul>
    </>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}

export default MainNavigation;
