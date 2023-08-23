import MedicineUsage from '../components/MedicineUsage/MedicineUsage';
import PageContent from '../components/PageContent';

function MedicineUsagePage() {
  return (
    <PageContent title="Welcome!">
      <div className="flex flex-nowrap flex-row gap-3">
        <div className="flex align-items-center flex-1">
          <MedicineUsage></MedicineUsage>
        </div>
      </div>
    </PageContent>
  )
}

export default MedicineUsagePage;
