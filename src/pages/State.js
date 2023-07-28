import PageContent from '../components/PageContent';
import State from '../components/State/State';




function StatePage() {
  return (
    <PageContent title="Welcome!">
      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <State></State>
        </div>
      </div>
    </PageContent>
  )
}

export default StatePage;
