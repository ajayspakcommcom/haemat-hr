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
import classes from './Zone.module.css';
import SkeletonComp from '../Skelton/Skelton';

const getZoneData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/zone/getall`,
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

const updateZone = async (id, updateText) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/zone/update`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "PUT",
            body: JSON.stringify({ zoneID: id, ZoneName: updateText, IsActive: true })
        });

    return await resp.json();

    // if (resp.ok) {
    //     return 'ok';
    // } else {
    //     return 'Something went wrong';
    // }
}

const createZone = async (designationText) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/zone/create`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({ ZoneName: designationText, IsActive: true })
        });

    const respData = await resp.json();
    return respData;
}

const Zone = (props) => {

    const [zone, setZone] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [deleteDesignationsDialog, setDeleteDesignationDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [zoneDialog, setZoneDialog] = useState(false);
    const [zoneItem, setZoneItem] = useState('');

    const toast = useRef(null);

    const onRowEditComplete = (e) => {
        let _zones = [...zone];
        let { newData, index } = e;
        _zones[index] = newData;

        if (_zones[index]) {
            updateZone(_zones[index].zoneID, _zones[index].ZoneName)
                .then(res => {
                    if (res.HasError) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: res.Errors[0], life: 3000 });
                    } else {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Update Successfully', life: 3000 });
                        setZone(_zones);
                    }
                }).catch((err) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                });
        }

    };

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedZone(value);
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
                    {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedZone || !selectedZone.length} /> */}
                </div>
            </>
        );
    };

    const hideDeleteDesignationDialog = () => {
        setDeleteDesignationDialog(false);
    };

    const deleteProduct = () => {
        const filteredDesignation = zone.filter(zoneItem => {
            return !selectedZone.find(item => {
                return item.DesignationId === zoneItem.DesignationId
            });
        });

        setZone(filteredDesignation);
        setDeleteDesignationDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const openNew = () => {
        //setSubmitted(false);
        setZoneDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setZoneDialog(false);
    };

    const deleteDesignationDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDesignationDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </>
    );

    const saveProduct = () => {
        //setSubmitted(true);
        createZone(zoneItem)
            .then(resp => {
                console.log(resp);

                if (resp.HasError) {
                    toast.current.show({ severity: "error", summary: "Error", detail: resp.Errors[0], life: 3000 });
                } else {
                    setZone((prevZone) => {
                        return [resp, ...prevZone];
                    });
                    setZoneDialog(false);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Zone Created", life: 3000 });
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
        setZoneItem(val);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h1 className="m-0 text-2xl font-bold">Zone</h1>
            <Button label="New" icon="pi pi-plus" severity="success" className='text-sm' onClick={openNew} />
        </div>
    );

    useEffect(() => {
        getZoneData()
            .then((res) => {
                setZone(res.Data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <Toast ref={toast} />

            {zone.length === 0 && <SkeletonComp />}

            {zone.length > 0 && <div className={`card ${classes['zone-wrapper']}`}>
                <DataTable value={zone} paginator rows={50} rowsPerPageOptions={[2, 4, 6, 8, 10]} header={header} editMode="row" onRowEditComplete={onRowEditComplete} selection={selectedZone} onSelectionChange={onSelectionChange} showGridlines paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" selectionMode="single">
                    <Column field="ZoneName" header="Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                    <Column header="Action" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>}



            <Dialog visible={zoneDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Add Zone" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText id="name" value={zone.ZoneName} onChange={(e) => onInputChange(e)} required autoFocus />
                </div>
            </Dialog>

            <Dialog visible={deleteDesignationsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDesignationDialogFooter} onHide={hideDeleteDesignationDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {zone && (
                        <span>Are you sure you want to delete?</span>
                    )}
                </div>
            </Dialog>
        </>
    );
};

export default Zone;