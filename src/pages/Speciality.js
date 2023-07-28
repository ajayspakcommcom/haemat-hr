import PageContent from '../components/PageContent';
import Speciality from '../components/Speciality/Speciality';



function SpecialityPage() {
  return (
    <PageContent title="Welcome!">

      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <Speciality></Speciality>
        </div>
      </div>
    </PageContent>
  )
}

export default SpecialityPage;
