import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAuthToken } from '../../util/auth';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import classes from './Hospital.module.css';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";

const getHospitalData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/hospital/getall`,
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

const updateHospital = async (objData) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/hospital/update`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "PUT",
            body: JSON.stringify({
                hospitalID: objData.hospitalID,
                hospitalname: objData.hospitalname,
                regionName: objData.regionName,
                totalBed: objData.totalBed,
                ICUBed: objData.ICUBed,
                isActive: objData.isActive,
                zoneID: objData.zoneID
            })
        });
    if (resp.ok) {
        return 'ok';
    } else {
        return 'Something went wrong';
    }
}

const createRegionData = async (ObjData) => {

    const resp = await fetch(`${process.env.REACT_APP_API_URL}/hospital/create`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({
                hospitalname: ObjData.HospitalName,
                regionName: ObjData.SelectedRegionName.RegionName,
                totalBed: null,
                ICUBed: null,
                isActive: ObjData.isVisibleValue,
                zoneID: ObjData.val
            })
        });

    const respData = await resp.json();
    return respData;
}

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

const Hospital = (props) => {

    const [hospitals, setHospitals] = useState([]);
    const [stateDialog, setStateDialog] = useState(false);
    const [regionsData, setRegionsData] = useState([]);
    const [regions, setRegions] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCheckbox, setSelectedCheckbox] = useState(false);
    const [hospitalName, setHospitalName] = useState('');
    const [createRegion, setCreateRegion] = useState([]);
    const [checkedCreate, setCheckedCreate] = useState(false);


    const toast = useRef(null);

    useEffect(() => {
        getHospitalData()
            .then((res) => {
                setHospitals(res.Data);
            })
            .catch(err => {
                console.log(err);
            });

        getRegionData()
            .then((res) => {
                const regionNames = res.Data.map((item) => {
                    return item.RegionName
                });
                setRegionsData(res.Data);
                setRegions(regionNames);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const onRowEditComplete = (e) => {

        let _hospitals = [...hospitals];
        let { newData, index } = e;
        _hospitals[index] = newData;
        _hospitals[index].isActive = selectedCheckbox;

        if (_hospitals[index]) {
            const resp = updateHospital(_hospitals[index]);
            resp.then(res => {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Update Successfully', life: 3000 });
            }).catch((err) => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
            });
        }

        setHospitals(_hospitals);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const openNew = () => {
        setStateDialog(true);
    };

    const hideDialog = () => {
        setStateDialog(false);
    };

    const saveProduct = () => {


        const hospText = hospitalName, selectedRegionText = createRegion, isVisibleVal = checkedCreate

        if (hospText === undefined || hospText === null || hospText === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter hospitals name", life: 3000 });
            return;
        }

        if (selectedRegionText.length <= 0) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please select region", life: 3000 });
            return;
        }


        const objData = {
            HospitalName: hospText,
            SelectedRegionName: selectedRegionText,
            isVisibleValue: isVisibleVal
        };

        createRegionData(objData)
            .then(resp => {
                setHospitals((prevHosp) => {
                    return [{ ...resp }, ...prevHosp];
                });
                setStateDialog(false);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Region Created", life: 3000 });
                setHospitalName('');
                setCreateRegion(null);
                setCheckedCreate(false);
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
        setHospitalName(val);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h1 className="m-0 text-2xl font-bold">Hospital</h1>
            <Button label="New" icon="pi pi-plus" severity="success" className='text-sm' onClick={openNew} />
        </div>
    );

    const regionEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={regions}
                placeholder="Select a Region"
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
        return <span>{rowData.regionName}</span>;
    };

    const isVisibleHandler = (rowData) => {
        return <Checkbox value={rowData.isActive} checked={rowData.isActive}></Checkbox>;
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
            <div className={`card ${classes['hospital-wrapper']}`}>
                <DataTable value={hospitals} paginator rows={50} rowsPerPageOptions={[2, 4, 6, 8, 10]} header={header} editMode="row" onRowEditComplete={onRowEditComplete} selectionMode="single">
                    {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} /> */}
                    <Column field="hospitalname" header="Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                    <Column field="regionName" header="Region Name" body={regionBodyTemplate} editor={(options) => regionEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="isActive" header="Is Visible" body={isVisibleHandler} editor={(options) => isVisibleEditor(options)} style={{ width: '20%' }}></Column>
                    <Column header="Action" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={stateDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Add Hospital" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog} showGridlines paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink">
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText id="name" value={hospitalName} onChange={(e) => onInputChange(e)} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Select Region</label>
                    <Dropdown value={createRegion} onChange={(e) => setCreateRegion(e.value)} options={regionsData} optionLabel="RegionName" editable placeholder="Select a Region" className="w-full" />
                </div>

                <div className="flex align-items-center">
                    <Checkbox id='isVisible' onChange={e => { setCheckedCreate(e.checked) }} checked={checkedCreate}></Checkbox>
                    <label htmlFor="isVisible" className="ml-2">Is Visible</label>
                </div>
            </Dialog>
        </>
    );
};

export default Hospital;