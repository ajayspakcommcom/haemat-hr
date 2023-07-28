import Designation from '../components/Designation/Designation';
import PageContent from '../components/PageContent';

function DesignationPage() {
  return (
    <PageContent title="Welcome!">

      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <Designation></Designation>
        </div>
      </div>

    </PageContent>
  )
}

export default DesignationPage;
