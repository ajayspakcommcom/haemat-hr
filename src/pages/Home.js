import Designation from '../components/Designation/Designation';
import PageContent from '../components/PageContent';
import Zone from '../components/Zone/Zone';
import State from '../components/State/State';
import Region from '../components/Region/Region';
import Hospital from '../components/Hospital/Hospital';
import Doctor from '../components/Doctor/Doctor';
import Speciality from '../components/Speciality/Speciality';



function HomePage() {
  return (
    <PageContent title="Welcome!">

      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <Doctor></Doctor>
        </div>
      </div>

      {/* <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <Designation></Designation>
        </div>
        <div className="flex align-items-center flex-1">
          <Zone></Zone>
        </div>
      </div>
      <div className="flex flex-nowrap flex-row gap-3 mt-3">
        <div className="flex align-items-center flex-1">
          <State></State>
        </div>
        <div className="flex align-items-center flex-1">
          <Region></Region>
        </div>
      </div>
      <div className="flex flex-nowrap flex-row gap-3 mt-3">
        <div className="flex align-items-center flex-1">
          <Hospital></Hospital>
        </div>
      </div> */}
    </PageContent>
  )
}

export default HomePage;
