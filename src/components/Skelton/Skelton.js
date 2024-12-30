import { Skeleton } from 'primereact/skeleton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const SkeletonComp = () => {

    const items = Array.from({ length: 10 }, (v, i) => i);

    const bodyTemplate = () => {
        return <Skeleton width="10rem" height="1rem" borderRadius="16px"></Skeleton>
    }

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h1 className="m-0 text-2xl font-bold"><Skeleton width="10rem" height="2rem" borderRadius="16px"></Skeleton></h1>
            <div className='flex gap-3'>
                <Skeleton width="10rem" height="3rem" borderRadius="8px"></Skeleton>
                <Skeleton width="10rem" height="3rem" borderRadius="8px"></Skeleton>
            </div>
        </div>
    );

    const title = (
        <Skeleton width="10rem" height="2rem" borderRadius="16px"></Skeleton>
    );

    return (
        <>
            <div className="card" style={{ width: '100%' }}>
                <DataTable value={items} className="p-datatable-striped" header={header} selectionMode="single">
                    <Column field="code" header={title} style={{ width: '25%' }} body={bodyTemplate}></Column>
                    <Column field="name" header={title} style={{ width: '25%' }} body={bodyTemplate}></Column>
                    <Column field="category" header={title} style={{ width: '25%' }} body={bodyTemplate}></Column>
                    <Column field="quantity" header={title} style={{ width: '25%' }} body={bodyTemplate}></Column>
                </DataTable>
            </div>
        </>
    );
};

export default SkeletonComp;