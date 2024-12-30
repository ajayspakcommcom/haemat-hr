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
import classes from './Speciality.module.css';
import { Checkbox } from 'primereact/checkbox';
import { FilterMatchMode } from 'primereact/api';
import SkeletonComp from '../Skelton/Skelton';

const getSpecialityData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/speciality/getall`,
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

const updateSpeciality = async (objData) => {
    console.log(objData)
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/speciality/update`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "PUT",
            body: JSON.stringify({
                specialtyId: objData.specialtyId,
                specialtyName: objData.specialtyName,
                IsActive: objData.IsActive
            })
        });

    return await resp.json();

    // if (resp.ok) {
    //     return 'ok';
    // } else {
    //     return 'Something went wrong';
    // }
}

const createDesignation = async (objData) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/speciality/create`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({ specialtyName: objData.specialtyName, IsActive: objData.IsActive })
        });

    const respData = await resp.json();
    return respData;
}

const Speciality = (props) => {

    const [speciality, setSpecility] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState(null);
    const [deleteSpecialityDialog, setDeleteSpecialityDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [specialityDialog, setSpecialityDialog] = useState(false);
    const [specialityItem, setSpecialityItem] = useState('');

    const [isVisible, setIsVisible] = useState(false);
    const [selectedCheckbox, setSelectedCheckbox] = useState(false);
    const [checkedCreate, setCheckedCreate] = useState(false);
    const [specialityName, setSpecialityName] = useState('');

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

        let _specility = [...speciality];
        let { newData, index } = e;
        _specility[index] = newData;
        _specility[index].IsActive = selectedCheckbox;

        if (_specility[index]) {
            updateSpeciality(_specility[index])
                .then(res => {
                    if (res.HasError) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: res.Errors[0], life: 3000 });
                    } else {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Update Successfully', life: 3000 });
                        setSpecility(_specility);
                    }
                }).catch((err) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                });
        }

    };

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedSpeciality(value);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const confirmDeleteSelected = () => {
        setDeleteSpecialityDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <div className="flex flex-wrap gap-2">
                    {/* <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} /> */}
                    {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedSpeciality || !selectedSpeciality.length} /> */}
                </div>
            </>
        );
    };

    const hideDeleteDesignationDialog = () => {
        setDeleteSpecialityDialog(false);
    };

    const deleteProduct = () => {
        const filteredDesignation = speciality.filter(specialityItem => {
            return !selectedSpeciality.find(item => {
                return item.DesignationId === specialityItem.DesignationId
            });
        });
        setSpecility(filteredDesignation);
        setDeleteSpecialityDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const openNew = () => {
        //setSubmitted(false);
        setSpecialityDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSpecialityDialog(false);
    };

    const deleteDesignationDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDesignationDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </>
    );

    const saveProduct = () => {

        // console.log(specialityName);
        // console.log(checkedCreate)

        if (specialityName === undefined || specialityName === null || specialityName === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter speciality name", life: 3000 });
            return;
        }

        const objData = {
            specialtyName: specialityName,
            IsActive: checkedCreate
        }

        createDesignation(objData)
            .then(resp => {

                console.log(resp);

                if (resp.HasError) {
                    toast.current.show({ severity: "error", summary: "Error", detail: resp.Errors[0], life: 3000 });
                } else {
                    setSpecility((prevSpeciality) => {
                        return [resp, ...prevSpeciality];
                    });
                    setSpecialityDialog(false);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Specility Created", life: 3000 });
                    setCheckedCreate(false);
                    setSpecialityName('')
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
        setSpecialityName(val);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h1 className="m-0 text-2xl font-bold">Specility</h1>
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
        getSpecialityData()
            .then((res) => {
                console.log(res)
                setSpecility(res.Data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const isVisibleHandler = (rowData) => {
        return <Checkbox value={rowData.IsActive} checked={rowData.IsActive}></Checkbox>;
    };

    const isVisibleEditor = (options) => {
        return <Checkbox onChange={e => { checkBoxHandler(e) }} checked={isVisible}></Checkbox>;
    };

    const checkBoxHandler = (obj) => {
        setIsVisible(obj.checked)
        setSelectedCheckbox(obj.checked);
    }

    return (
        <>
            <Toast ref={toast} />

            {speciality.length === 0 && <SkeletonComp />}
            {speciality.length > 0 && <div className={`card ${classes['speciality-wrapper']}`}>
                <DataTable value={speciality}
                    paginator rows={50} rowsPerPageOptions={[2, 4, 6, 8, 10]}
                    header={header} editMode="row" onRowEditComplete={onRowEditComplete}
                    selection={selectedSpeciality} onSelectionChange={onSelectionChange} showGridlines
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    globalFilterFields={['specialtyName']} filters={filters} selectionMode="single">
                    <Column field="specialtyName" header="Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                    <Column field="isActive" header="Is Visible" body={isVisibleHandler} editor={(options) => isVisibleEditor(options)} style={{ width: '20%' }}></Column>
                    <Column header="Action" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>}



            <Dialog visible={specialityDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Add Speciality" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText id="name" value={specialityName} onChange={(e) => onInputChange(e)} required autoFocus />
                </div>
                <div className="flex align-items-center">
                    <Checkbox id='isVisible' onChange={e => { setCheckedCreate(e.checked) }} checked={checkedCreate}></Checkbox>
                    <label htmlFor="isVisible" className="ml-2">Is Visible</label>
                </div>
            </Dialog>

            <Dialog visible={deleteSpecialityDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDesignationDialogFooter} onHide={hideDeleteDesignationDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {speciality && (<span>Are you sure you want to delete?</span>)}
                </div>
            </Dialog>
        </>
    );
};

export default Speciality;