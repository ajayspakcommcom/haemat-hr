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
import classes from './Region.module.css';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import SkeletonComp from '../Skelton/Skelton';

const getRegionData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/region/getall`,
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

const updateRegion = async (regionId, regionName, regionInchargeID, stateId) => {
    console.log(regionId, regionName, regionInchargeID, stateId);
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/region/update`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "PUT",
            body: JSON.stringify({ RegionID: regionId, RegionName: regionName, RegionInchargeID: regionInchargeID, StateID: stateId })
        });

    return await resp.json();

    // if (resp.ok) {
    //     return 'ok';
    // } else {
    //     return 'Something went wrong';
    // }
}

const createRegion = async (regionText, regionInchargeID, stateId) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/region/create`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({ RegionName: regionText, RegionInchargeID: regionInchargeID, StateID: stateId })
        });

    const respData = await resp.json();
    return respData;
}

const getStateData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/state/getall`,
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

const Region = (props) => {

    const [region, setRegion] = useState([]);
    const [deleteStatesDialog, setDeleteStateDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [stateDialog, setStateDialog] = useState(false);
    const [stateItem, setStateItem] = useState('');
    const [statesData, setStatesData] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [regionData, setRegionData] = useState('');

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
        getRegionData()
            .then((res) => {
                console.log(res.Data)
                setRegion(res.Data);
            })
            .catch(err => {
                console.log(err);
            });

        getStateData()
            .then((res) => {
                const stateNames = res.Data.map((item) => {
                    return item.StateName
                });
                setStatesData(res.Data);
                setStates(stateNames);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const onRowEditComplete = (e) => {
        let _regions = [...region];
        let { newData, index } = e;
        _regions[index] = newData;

        const stateId = statesData.find(item => {
            return item.StateName ? item.StateName.trim().toLowerCase() === _regions[index].StateName.trim().toLowerCase() : '';
        })?.StateID;

        console.log(_regions[index]);
        console.log(stateId);

        if (_regions[index]) {
            updateRegion(_regions[index].RegionID, _regions[index].RegionName, _regions[index].RegionInchargeID, stateId)
                .then(res => {
                    if (res.HasError) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: res.Errors[0], life: 3000 });
                    } else {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Update Successfully', life: 3000 });
                        setRegion(_regions);
                    }

                }).catch((err) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                });
        }

    };

    const onSelectionChange = (event) => {
        const value = event.value;
        //setSelectedState(value);
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
            <Button label="Yes" icon="pi pi-check" severity="danger" />
        </>
    );

    const saveProduct = () => {

        const regionDataText = regionData, selectedStateData = selectedState;



        if (regionDataText === undefined || regionDataText === null || regionDataText === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter region name", life: 3000 });
            return;
        }

        if (selectedStateData === null) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please select state", life: 3000 });
            return;
        }

        // console.log(regionDataText);
        // console.log(selectedStateData);

        createRegion(regionDataText, selectedStateData.RegionInchargeID, selectedStateData.StateID)
            .then(resp => {

                console.log(resp);

                if (resp.HasError) {
                    toast.current.show({ severity: "error", summary: "Error", detail: resp.Errors[0], life: 3000 });
                } else {
                    resp.StateName = selectedStateData.StateName;
                    setRegion((prevRegion) => {
                        return [{ ...resp }, ...prevRegion];
                    });

                    setStateDialog(false);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Region Created", life: 3000 });
                    setRegionData('');
                    setSelectedState(null);
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
        setRegionData(val);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h1 className="m-0 text-2xl font-bold">Region</h1>
            <div className='flex'>
                <span className="p-input-icon-left mr-2">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </span>
                <Button label="New" icon="pi pi-plus" severity="success" className='text-sm' onClick={openNew} />
            </div>
        </div>
    );

    const regionEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={states}
                placeholder="Select a State"
                onChange={(e) => {
                    options.editorCallback(e.value);
                }}
                itemTemplate={(option) => {
                    return <span>{option}</span>
                }}
            />
        );
    };

    const regionBodyTemplate = (rowData) => {
        return <span>{rowData.StateName}</span>;
    };

    return (
        <>
            <Toast ref={toast} />

            {region.length === 0 && <SkeletonComp />}

            {region.length > 0 && <div className={`card ${classes['region-wrapper']}`}>
                <DataTable value={region} paginator rows={50}
                    rowsPerPageOptions={[2, 4, 6, 8, 10]} header={header}
                    editMode="row" onRowEditComplete={onRowEditComplete}
                    showGridlines paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    globalFilterFields={['RegionName', 'StateName']}
                    filters={filters} selectionMode="single">
                    <Column field="RegionName" header="Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                    <Column field="StateName" header="State Name" body={regionBodyTemplate} editor={(options) => regionEditor(options)} style={{ width: '20%' }}></Column>
                    <Column header="Action" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>}



            <Dialog visible={stateDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Add Region" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText id="name" value={regionData} onChange={(e) => onInputChange(e)} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Select State</label>
                    <Dropdown value={selectedState} onChange={(e) => setSelectedState(e.value)} options={statesData} optionLabel="StateName" editable placeholder="Select a State" className="w-full" />
                </div>
            </Dialog>

            <Dialog visible={deleteStatesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDesignationDialogFooter} onHide={hideDeleteDesignationDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {region && (<span>Are you sure you want to delete?</span>)}
                </div>
            </Dialog>
        </>
    );
};

export default Region;