import { useEffect, useState } from 'react';
import PageContent from '../components/PageContent';
import EmployeeItem from '../components/Employee/EmployeeItem';
import { useParams } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

const getDoctorByEmpId = async (empId) => {
  const resp = await fetch(`${process.env.REACT_APP_API_URL}/doctor/getbyemp/${empId}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      method: "GET"
    });
  const data = await resp.json();
  return data;
}

const getDoctorWithoutEmp = async () => {
  const resp = await fetch(`${process.env.REACT_APP_API_URL}/doctor/getwithoutemp`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      method: "GET"
    });
  const data = await resp.json();
  return data;
}

function EmployeeDetailPage() {

  const [withEmpDrData, setWithEmpDrData] = useState([]);
  const [withoutEmpDrData, setWithoutEmpDrData] = useState([]);
  const [isAssignedDoctor, setIsAssignedDoctor] = useState(true);

  let { empId } = useParams();


  useEffect(() => {

    getDoctorByEmpId(empId)
      .then((res) => {
        setWithEmpDrData(res.Data);
      })
      .catch(err => {
        console.log(err);
      });


    getDoctorWithoutEmp()
      .then((res) => {
        setWithoutEmpDrData(res.Data)
      })
      .catch(err => {
        console.log(err);
      });
    console.log(empId);
  }, [empId]);

  const toggleAssignedData = () => {
    setIsAssignedDoctor(!isAssignedDoctor);
  };

  return (
    <PageContent title="Welcome!">
      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <EmployeeItem data={isAssignedDoctor ? withEmpDrData : withoutEmpDrData} empId={empId} onToggleData={toggleAssignedData} isAssignedDr={isAssignedDoctor}></EmployeeItem>
        </div>
      </div>
    </PageContent>
  )
}

export default EmployeeDetailPage;
