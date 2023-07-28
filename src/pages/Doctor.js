import PageContent from '../components/PageContent';
import Doctor from '../components/Doctor/Doctor';


function DoctorPage() {
  return (
    <PageContent title="Welcome!">
      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <Doctor></Doctor>
        </div>
      </div>
    </PageContent>
  )
}

export default DoctorPage;
