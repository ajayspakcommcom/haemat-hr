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
import classes from './Designation.module.css';
import { FilterMatchMode } from 'primereact/api';
import SkeletonComp from '../Skelton/Skelton';


const getDesignationData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/designation/getall`,
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

const updateDesignation = async (id, updateText) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/designation/update`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({ DesignationId: id, DesignationName: updateText })
        });

    return await resp.json();
    // if (resp.ok) {
    //     return 'ok';
    // } else {
    //     return 'Something went wrong';
    // }
}

const createDesignation = async (designationText) => {
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

const Designation = (props) => {

    const [designation, setDesignation] = useState([]);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [deleteDesignationsDialog, setDeleteDesignationDialog] = useState(false);
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
        let _designations = [...designation];
        let { newData, index } = e;
        _designations[index] = newData;

        if (_designations[index]) {
            updateDesignation(_designations[index].DesignationId, _designations[index].DesignationName)
                .then(res => {
                    if (res.HasError) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                    } else {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Update Successfully', life: 3000 });
                        setDesignation(_designations);
                    }
                }).catch((err) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                });
        }
    };

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedDesignation(value);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const confirmDeleteSelected = () => {
        setDeleteDesignationDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <div className="flex flex-wrap gap-2">
                    {/* <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} /> */}
                    {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedDesignation || !selectedDesignation.length} /> */}
                </div>
            </>
        );
    };

    const hideDeleteDesignationDialog = () => {
        setDeleteDesignationDialog(false);
    };

    const deleteProduct = () => {
        const filteredDesignation = designation.filter(designationItem => {
            return !selectedDesignation.find(item => {
                return item.DesignationId === designationItem.DesignationId
            });
        });

        setDesignation(filteredDesignation);
        setDeleteDesignationDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const openNew = () => {
        //setSubmitted(false);
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
        createDesignation(designationItem)
            .then(resp => {
                console.log(resp);

                if (resp.HasError) {
                    toast.current.show({ severity: "error", summary: "Error", detail: resp.Errors[0], life: 3000 });
                } else {
                    setDesignation((prevDesignation) => {
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
            <h1 className="m-0 text-2xl font-bold">Designation</h1>
            <div className='flex'>
                <span className="p-input-icon-left mr-2">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </span>
                <Button label="New" icon="pi pi-plus" severity="success" className='text-sm' onClick={openNew} />
            </div>
        </div>
    );

    useEffect(() => {
        getDesignationData()
            .then((res) => {
                setDesignation(res.Data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <Toast ref={toast} />


            {designation.length === 0 && <SkeletonComp />}

            {designation.length > 0 &&
                <div className={`card ${classes['designation-wrapper']}`}>
                    <DataTable value={designation}
                        paginator rows={50}
                        rowsPerPageOptions={[2, 4, 6, 8, 10]}
                        header={header} editMode="row"
                        onRowEditComplete={onRowEditComplete}
                        selection={selectedDesignation}
                        onSelectionChange={onSelectionChange}
                        showGridlines paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        globalFilterFields={['DesignationName']} filters={filters}
                        selectionMode="single"
                    >
                        <Column field="DesignationName" header="Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column header="Action" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
                </div>
            }


            <Dialog visible={designationDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Add Designation" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText id="name" value={designation.DesignationName} onChange={(e) => onInputChange(e)} required autoFocus />
                </div>
            </Dialog>

            <Dialog visible={deleteDesignationsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDesignationDialogFooter} onHide={hideDeleteDesignationDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {designation && (
                        <span>Are you sure you want to delete?</span>
                    )}
                </div>
            </Dialog>
        </>
    );
};

export default Designation;