import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAuthToken } from '../../util/auth';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from "primereact/utils";
import classes from './MedicineUsage.module.css';
import { FilterMatchMode } from 'primereact/api';
import SkeletonComp from '../Skelton/Skelton';


const getMedicineUsageData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/medicineusage/getall`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "GET"
        });
    const data = await resp.json();
    return data;
}

const updateMedicineUsage = async (dataObj) => {

    const resp = await fetch(`${process.env.REACT_APP_API_URL}/medicineusage/update`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "PUT",
            body: JSON.stringify({ ...dataObj })
        });

    return await resp.json();
}

const createMedicineUsage = async (designationText) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/designation/create`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({ DesignationName: designationText })
        });

    const respData = await resp.json();
    return respData;
}

const deleteMedicineUsage = async (id) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/medicineusage/delete/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "DELETE"
        });
    // const respData = await resp.json();
    // return respData;
    return null;
}

const MedicineUsage = (props) => {

    const [medicineUsage, setMedicineUsage] = useState([]);
    const [selectedMedicineUsage, setSelectedMedicineUsage] = useState(null);
    const [deleteMedicineUsagesDialog, setDeleteMedicineUsageDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [designationDialog, setDesignationDialog] = useState(false);
    const [designationItem, setDesignationItem] = useState('');

    const toast = useRef(null);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onRowEditComplete = (e) => {
        let _medicineUsages = [...medicineUsage];
        let { newData, index } = e;
        _medicineUsages[index] = newData;

        _medicineUsages[index].CreatedDate = new Date(_medicineUsages[index].CreatedDate).toISOString().slice(0, 10);
        _medicineUsages[index].OrderDate = new Date(_medicineUsages[index].OrderDate).toISOString().slice(0, 10);

        if (_medicineUsages[index]) {
            updateMedicineUsage(_medicineUsages[index])
                .then(res => {
                    if (res.HasError) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                    } else {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Update Successfully', life: 3000 });
                        setMedicineUsage(_medicineUsages);
                    }
                }).catch((err) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                });
        }
    };

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedMedicineUsage(value);
        console.log(selectedMedicineUsage);
    };

    const textEditor = (options) => {
        console.log(options);

        if (options.field === "EmployeeName" || options.field === "OrderDate" || options.field === "DoctorsName" || options.field === "SpecialityName" || options.field === "HospitalName" || options.field === "HospitalCity" || options.field === "Indication" || options.field === "MedicineName") {
            return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} disabled />;
        }
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const confirmDeleteSelected = () => {
        setDeleteMedicineUsageDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <div className="flex flex-wrap gap-2">
                    {/* <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} /> */}
                    {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedMedicineUsage || !selectedMedicineUsage.length} /> */}
                </div>
            </>
        );
    };

    const hideDeleteDesignationDialog = () => {
        setDeleteMedicineUsageDialog(false);
    };

    const deleteProduct = () => {
        const filteredMedicineUsage = medicineUsage.filter(MedicineUsageItem => {
            return !selectedMedicineUsage.find(item => {
                return item.MedicineUsageId === MedicineUsageItem.MedicineUsageId
            });
        });

        const medIds = selectedMedicineUsage.map(item => item.MedicineUsageId);

        for (const id of medIds) {
            deleteMedicineUsage(id);
        }

        setMedicineUsage(filteredMedicineUsage);
        setDeleteMedicineUsageDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Medicine Deleted', life: 3000 });
    };

    const openNew = () => {
        setDesignationDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDesignationDialog(false);
    };

    const deleteDesignationDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDesignationDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </>
    );

    const saveProduct = () => {
        createMedicineUsage(designationItem)
            .then(resp => {
                console.log(resp);

                if (resp.HasError) {
                    toast.current.show({ severity: "error", summary: "Error", detail: resp.Errors[0], life: 3000 });
                } else {
                    setMedicineUsage((prevDesignation) => {
                        return [resp, ...prevDesignation];
                    });
                    setDesignationDialog(false);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Designation Created", life: 3000 });
                }
            })
            .catch(err => {
                console.log(err)
            });
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </>
    );


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        setDesignationItem(val);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h1 className="m-0 text-2xl font-bold">Medicine Usage</h1>
            <div className='flex'>
                <span className="p-input-icon-left mr-2">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </span>
                {/* <Button label="New" icon="pi pi-plus" severity="success" className='text-sm' onClick={openNew} /> */}
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedMedicineUsage || !selectedMedicineUsage.length} className='delete-icon' />
            </div>
        </div>
    );

    useEffect(() => {
        getMedicineUsageData()
            .then((res) => {
                console.log(res.Data)

                res.Data.sort((a, b) => {
                    let dateA = new Date(a.CreatedDate);
                    let dateB = new Date(b.CreatedDate);
                    return dateA - dateB;
                }).reverse();

                setMedicineUsage(res.Data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <Toast ref={toast} />

            {medicineUsage.length === 0 && <SkeletonComp />}

            {medicineUsage.length > 0 &&
                <div className={`card ${classes['medicine-usage-wrapper']}`}>
                    <DataTable value={medicineUsage}
                        paginator rows={50}
                        rowsPerPageOptions={[2, 4, 6, 8, 10]}
                        header={header} editMode="row"
                        onRowEditComplete={onRowEditComplete}
                        selection={selectedMedicineUsage}
                        onSelectionChange={onSelectionChange}
                        showGridlines paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        globalFilterFields={['EmployeeName', 'OrderDate', 'DoctorsName', 'SpecialityName', 'HospitalName', 'HospitalCity', 'Indication']} filters={filters}
                        selectionMode="multiple"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

                        <Column field="EmployeeName" header="Employee Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="OrderDate" header="Order Date" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="DoctorsName" header="Doctor Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="SpecialityName" header="Speciality Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="HospitalName" header="Hospital Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="HospitalCity" header="Hospital City" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="Indication" header="Indication" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>

                        <Column field="MedicineName" header="Medicine Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>

                        <Column field="NoOfPatients" header="No Of Patients" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="NoOfVials" header="No Of Vials" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="strips" header="Strips" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="PapValue" header="Pap Value" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column header="Action" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
                </div>
            }


            {/* <Dialog visible={designationDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Add Designation" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText id="name" value={medicineUsage.DesignationName} onChange={(e) => onInputChange(e)} required autoFocus />
                </div>
            </Dialog> */}

            <Dialog visible={deleteMedicineUsagesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDesignationDialogFooter} onHide={hideDeleteDesignationDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {medicineUsage && (
                        <span>Are you sure you want to delete?</span>
                    )}
                </div>
            </Dialog>
        </>
    );
};

export default MedicineUsage;