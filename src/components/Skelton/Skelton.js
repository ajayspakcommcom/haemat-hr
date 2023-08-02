import { Skeleton } from 'primereact/skeleton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const SkeletonComp = () => {

    const items = Array.from({ length: 5 }, (v, i) => i);

    const bodyTemplate = () => {
        return <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
    }

    return (
        <>
            <div className="card">
                <DataTable value={items} className="p-datatable-striped">
                    <Column field="code" header="Code" style={{ width: '25%' }} body={bodyTemplate}></Column>
                    <Column field="name" header="Name" style={{ width: '25%' }} body={bodyTemplate}></Column>
                    <Column field="category" header="Category" style={{ width: '25%' }} body={bodyTemplate}></Column>
                    <Column field="quantity" header="Quantity" style={{ width: '25%' }} body={bodyTemplate}></Column>
                </DataTable>
            </div>
        </>
    );
};

export default SkeletonComp;