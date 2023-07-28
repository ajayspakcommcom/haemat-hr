import PageContent from '../components/PageContent';
import Hospital from '../components/Hospital/Hospital';


function HospitalPage() {
  return (
    <PageContent title="Welcome!">
      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <Hospital></Hospital>
        </div>
      </div>
    </PageContent>
  )
}

export default HospitalPage;
