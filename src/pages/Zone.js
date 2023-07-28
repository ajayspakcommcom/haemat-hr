
import PageContent from '../components/PageContent';
import Zone from '../components/Zone/Zone';



function ZonePage() {
  return (
    <PageContent title="Welcome!">

      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <Zone></Zone>
        </div>
      </div>
    </PageContent>
  )
}

export default ZonePage;
