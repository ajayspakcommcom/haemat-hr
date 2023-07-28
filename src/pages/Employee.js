import PageContent from '../components/PageContent';
import Employee from '../components/Employee/Employee';


function EmployeePage() {
  return (
    <PageContent title="Welcome!">
      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <Employee></Employee>
        </div>
      </div>
    </PageContent>
  )
}

export default EmployeePage;
