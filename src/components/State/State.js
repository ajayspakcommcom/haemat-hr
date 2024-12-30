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
import classes from './State.module.css';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import SkeletonComp from '../Skelton/Skelton';

const getStateData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/State/getall`,
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

const updateState = async (stateId, stateName, zoneId, stateInchargeId) => {
    console.log(stateId, stateName, zoneId, stateInchargeId);
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/State/Update`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "PUT",
            body: JSON.stringify({ StateID: stateId, StateName: stateName, ZoneID: zoneId })
        });

    return await resp.json();

    // if (resp.ok) {
    //     return 'ok';
    // } else {
    //     return 'Something went wrong';
    // }
}

const createState = async (stateName, zoneId, stateInchargeId) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/state/create`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({ StateName: stateName, ZoneID: zoneId, StateInchargeID: stateInchargeId })
        });

    const respData = await resp.json();
    return respData;
}

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

const State = (props) => {

    const [state, setState] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [deleteStatesDialog, setDeleteStateDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [stateDialog, setStateDialog] = useState(false);
    const [stateItem, setStateItem] = useState('');
    const [zonesData, setZonesData] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [stateData, setStateData] = useState('');

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

    useEffect(() => {
        getStateData()
            .then((res) => {
                console.log(res.Data)
                setState(res.Data);
            })
            .catch(err => {
                console.log(err);
            });

        getZoneData()
            .then((res) => {
                const zoneNames = res.Data.map((item) => {
                    return item.ZoneName
                });
                setZonesData(res.Data);
                setZones(zoneNames);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const onRowEditComplete = (e) => {
        let _states = [...state];
        let { newData, index } = e;
        _states[index] = newData;

        const zoneId = zonesData.find(item => {
            return item.ZoneName ? item.ZoneName.trim().toLowerCase() === _states[index].ZoneName.trim().toLowerCase() : '';
        })?.zoneID;

        if (_states[index]) {
            updateState(_states[index].StateID, _states[index].StateName, zoneId, _states[index].StateInchargeID)
                .then(res => {

                    if (res.HasError) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: res.Errors[0], life: 3000 });
                    } else {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Update Successfully', life: 3000 });
                        setState(_states);
                    }

                }).catch((err) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                });
        }

    };

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedState(value);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const confirmDeleteSelected = () => {
        setDeleteStateDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <div className="flex flex-wrap gap-2">
                    {/* <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} /> */}
                    {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedState || !selectedState.length} /> */}
                </div>
            </>
        );
    };

    const hideDeleteDesignationDialog = () => {
        setDeleteStateDialog(false);
    };

    const deleteProduct = () => {
        const filteredDesignation = state.filter(stateItem => {
            return !selectedState.find(item => {
                return item.DesignationId === stateItem.DesignationId
            });
        });

        setState(filteredDesignation);
        setDeleteStateDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const openNew = () => {
        //setSubmitted(false);
        setStateDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStateDialog(false);
    };

    const deleteDesignationDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDesignationDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </>
    );

    const saveProduct = () => {

        const stateDataText = stateData, selectedZoneData = selectedZone;

        if (stateDataText === undefined || stateDataText === null || stateDataText === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter state name", life: 3000 });
            return;
        }

        if (selectedZoneData === null) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please select zone", life: 3000 });
            return;
        }

        createState(stateDataText, selectedZoneData.zoneID, 0)
            .then(resp => {

                if (resp.HasError) {
                    toast.current.show({ severity: "error", summary: "Error", detail: resp.Errors[0], life: 3000 });
                } else {
                    resp.ZoneName = selectedZoneData.ZoneName;
                    setState((prevState) => {
                        return [{ ...resp }, ...prevState];
                    });
                    setStateDialog(false);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "State Created", life: 3000 });
                    setStateData('');
                    setSelectedZone(null);
                }
            })
            .catch(err => {
                console.log(err);
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
        setStateData(val);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h1 className="m-0 text-2xl font-bold">State</h1>
            <div className='flex'>
                <span className="p-input-icon-left mr-2">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </span>
                <Button label="New" icon="pi pi-plus" severity="success" className='text-sm' onClick={openNew} />
            </div>
        </div>
    );

    const selectedZoneTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const zoneEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={zones}
                placeholder="Select a Zone"
                onChange={(e) => { options.editorCallback(e.value) }}
                itemTemplate={(option) => { return <span>{option}</span> }}
                filter valueTemplate={selectedZoneTemplate}
            />
        );
    };

    const zoneBodyTemplate = (rowData) => {
        return <span>{rowData.ZoneName}</span>;
    };


    const createSelectedZoneTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.ZoneName}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const createSelectedZoneOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.ZoneName}</div>
            </div>
        );
    };


    return (
        <>
            <Toast ref={toast} />

            {state.length === 0 && <SkeletonComp />}

            {state.length > 0 && <div className={`card ${classes['state-wrapper']}`}>
                <DataTable value={state} paginator rows={50}
                    rowsPerPageOptions={[2, 4, 6, 8, 10]} header={header}
                    editMode="row" onRowEditComplete={onRowEditComplete}
                    selection={selectedState} onSelectionChange={onSelectionChange}
                    showGridlines paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    globalFilterFields={['StateName', 'ZoneName']} filters={filters} selectionMode="single">
                    <Column field="StateName" header="Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                    <Column field="ZoneName"
                        header="Zone"
                        body={zoneBodyTemplate}
                        editor={(options) => zoneEditor(options)}
                        style={{ width: '20%' }}
                    ></Column>
                    <Column header="Action" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>}


            <Dialog visible={stateDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Add State" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText id="name" value={stateData} onChange={(e) => onInputChange(e)} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Select Zone</label>
                    <Dropdown
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.value)}
                        options={zonesData} optionLabel="ZoneName"
                        editable placeholder="Select a State" className="w-full"
                        filter
                        valueTemplate={createSelectedZoneTemplate}
                        itemTemplate={createSelectedZoneOptionTemplate}
                    />
                </div>
            </Dialog>

            <Dialog visible={deleteStatesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDesignationDialogFooter} onHide={hideDeleteDesignationDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {state && (<span>Are you sure you want to delete?</span>)}
                </div>
            </Dialog>
        </>
    );
};

export default State;