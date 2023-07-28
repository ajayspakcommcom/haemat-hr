import PageContent from '../components/PageContent';
import Region from '../components/Region/Region';


function RegionPage() {
  return (
    <PageContent title="Welcome!">

      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <Region></Region>
        </div>
      </div>
    </PageContent>
  )
}

export default RegionPage;
