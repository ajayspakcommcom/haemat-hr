import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { useNavigate } from "react-router-dom";
import { Column } from 'primereact/column';
import { getAuthToken } from '../../util/auth';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import classes from './Employee.module.css';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { FilterMatchMode } from 'primereact/api';
import SkeletonComp from '../Skelton/Skelton';


const getEmployeeData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/employee/getall`,
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

const updateEmployee = async (objData) => {
    delete objData.createdOn;
    console.log(JSON.stringify({ ...objData }));
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/employee/update`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "PUT",
            body: JSON.stringify({ ...objData })
        });

    return await resp.json();

    // if (resp.ok) {
    //     return 'ok';
    // } else {
    //     return 'Something went wrong';
    // }
}

const createEmployeeData = async (objData) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/employee/create`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({ ...objData })
        });

    const respData = await resp.json();
    return respData;
}

const Employee = (props) => {

    const [employees, setEmployees] = useState([]);

    const [states, setStates] = useState([]);
    const [stateName, setStateName] = useState([]);

    const [zones, setZones] = useState([]);
    const [zoneName, setZoneName] = useState([]);

    const [regions, setRegions] = useState([]);
    const [regionName, setRegionName] = useState([]);

    const [designation, setDesignation] = useState([]);
    const [designationName, setDesignationName] = useState([]);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedCheckbox, setSelectedCheckbox] = useState(false);

    const [popDialog, setPopDialog] = useState(false);

    //
    const [empName, setEmpName] = useState('');
    const [empEmail, setEmpEmail] = useState('');
    const [empPassword, setEmpPassword] = useState('');
    const [empMobile, setEmpMobile] = useState('');
    const [empHQName, setEmpHQName] = useState('');
    const [empNumber, setEmpNumber] = useState('');
    const [empHQCode, setEmpHQCode] = useState('');

    const [createStateDropdown, setCreateStateDropdown] = useState(false);
    const [createZoneDropdown, setCreateZoneDropdown] = useState(false);
    const [createRegionDropdown, setCreateRegionDropdown] = useState(false);
    const [createDesignationDropdown, setCreateDesignationDropdown] = useState(false);
    const [checkedIsVisible, setCheckedIsVisible] = useState(false);

    const navigate = useNavigate();

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

        getEmployeeData()
            .then((res) => {
                console.log(res.Data)
                const filteredData = res.Data.map(item => {
                    //item.isActive = item.isActive === 0 ? item.isActive = false : item.isActive = true;
                    return { ...item };
                });

                setEmployees(filteredData);
            })
            .catch(err => {
                console.log(err);
            });

        getStateData()
            .then((res) => {
                const stateName = res.Data.map((item) => {
                    return item.StateName
                });

                setStates(res.Data);
                setStateName(stateName);
            })
            .catch(err => {
                console.log(err);
            });


        getZoneData()
            .then((res) => {
                const zoneName = res.Data.map((item) => {
                    return item.ZoneName;
                });
                setZones(res.Data)
                setZoneName(zoneName);
            })
            .catch(err => {
                console.log(err);
            });

        getRegionData()
            .then((res) => {
                const regionName = res.Data.map((item) => {
                    return item.RegionName;
                });
                setRegions(res.Data)
                setRegionName(regionName);
            })
            .catch(err => {
                console.log(err);
            });

        getDesignationData()
            .then((res) => {
                const designationName = res.Data.map((item) => {
                    return item.DesignationName;
                });
                setDesignation(res.Data)
                setDesignationName(designationName);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);


    const openNew = () => {
        setPopDialog(true);
    };

    const hideDialog = () => {
        setPopDialog(false);
    };

    const onRowEditComplete = (e) => {

        let _employees = [...employees];
        let { newData, index } = e;
        _employees[index] = newData;
        _employees[index].isActive = selectedCheckbox;

        const stateId = states.find(item => (item.StateName || '').trim().toLowerCase() === (_employees[index].StateName || '').trim().toLowerCase()).StateID;
        const zoneId = zones.find(item => (item.ZoneName || '').trim().toLowerCase() === (_employees[index].ZoneName || '').trim().toLowerCase()).zoneID;
        const designationId = designation.find(item => (item.DesignationName || '').trim().toLowerCase() === (_employees[index].DesignationName || '').trim().toLowerCase()).DesignationId;

        _employees[index].StateID = stateId;
        _employees[index].ZoneID = zoneId;
        _employees[index].DesignationID = designationId;

        if (_employees[index]) {
            updateEmployee(_employees[index])
                .then(res => {
                    console.log(res);
                    if (res.HasError) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: res.Errors[0], life: 3000 });
                    } else {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Update Successfully', life: 3000 });
                        setEmployees(_employees);
                    }
                }).catch((err) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                });
        }


    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const header = (
        <>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h1 className="m-0 text-2xl font-bold">Employee</h1>
                <div className='flex'>
                    <span className="p-input-icon-left mr-2">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                    </span>
                    <Button label="New" icon="pi pi-plus" severity="success" className='text-sm' onClick={openNew} />
                </div>
            </div>
        </>
    );

    const stateBodyTemplate = (rowData) => {
        return <span>{rowData.StateName}</span>;
    };

    const stateEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={stateName}
                placeholder="Select a State"
                onChange={(e) => {
                    console.log(e);
                    options.editorCallback(e.value);
                }}
                itemTemplate={(option) => {
                    return <span>{option}</span>
                }}
            />
        );
    };

    const zoneBodyTemplate = (rowData) => {
        return <span>{rowData.ZoneName}</span>;
    };

    const zoneEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={zoneName}
                placeholder="Select a Zone"
                onChange={(e) => {
                    console.log(e);
                    options.editorCallback(e.value);
                }}
                itemTemplate={(option) => {
                    return <span>{option}</span>
                }}
            />
        );
    };

    const regionBodyTemplate = (rowData) => {
        return <span>{rowData.RegionName}</span>;
    };

    const regionEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={regionName}
                placeholder="Select a Region"
                onChange={(e) => {
                    console.log(e);
                    options.editorCallback(e.value);
                }}
                itemTemplate={(option) => {
                    return <span>{option}</span>
                }}
            />
        );
    };

    const designationBodyTemplate = (rowData) => {
        return <span>{rowData.DesignationName}</span>;
    };

    const designationEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={designationName}
                placeholder="Select a Designation"
                onChange={(e) => {
                    console.log(e);
                    options.editorCallback(e.value);
                }}
                itemTemplate={(option) => {
                    return <span>{option}</span>
                }}
            />
        );
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

    const saveProduct = () => {

        if (empName === undefined || empName === null || empName === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter Employee name", life: 3000 });
            return;
        }

        if (empEmail === undefined || empEmail === null || empEmail === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter Employee email", life: 3000 });
            return;
        }

        if (empPassword === undefined || empPassword === null || empPassword === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter Employee password", life: 3000 });
            return;
        }

        if (empMobile === undefined || empMobile === null || empMobile === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter Employee mobile", life: 3000 });
            return;
        }

        if (empHQName === undefined || empHQName === null || empHQName === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter Employee HQ name", life: 3000 });
            return;
        }

        if (empNumber === undefined || empNumber === null || empNumber === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter Employee number", life: 3000 });
            return;
        }

        if (empHQCode === undefined || empHQCode === null || empHQCode === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter Employee HQ code", life: 3000 });
            return;
        }

        if (!createStateDropdown) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please select state", life: 3000 });
            return;
        }

        if (!createZoneDropdown) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please select zone", life: 3000 });
            return;
        }

        if (!createRegionDropdown) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please region region", life: 3000 });
            return;
        }

        if (!createDesignationDropdown) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please designation designation", life: 3000 });
            return;
        }


        const objData = {
            "EmpID": null,
            "Password": empPassword,
            "Email": empEmail,
            "firstName": empName,
            "middleName": null,
            "lastName": null,
            "LastLoginDate": null,
            "DesignationID": createDesignationDropdown.DesignationId,
            "DesignationName": createDesignationDropdown.DesignationName,
            "MobileNumber": empMobile,
            "HQName": empHQName,
            "EmpNumber": empNumber,
            "StateID": createStateDropdown.StateID,
            "StateName": createStateDropdown.StateName,
            "Comments": "",
            "DOJ": new Date().toISOString().split('T')[0],
            "HQCode": empHQCode,
            "ZoneID": createZoneDropdown.zoneID,
            "ZoneName": createZoneDropdown.ZoneName,
            "isMetro": null,
            "regionName": createRegionDropdown.RegionName,
            "isActive": checkedIsVisible,
            "Division": null,
            "HiDocDoJ": null,
            "SeravaccDoJ": null
        }

        console.log(objData);


        createEmployeeData(objData)
            .then(resp => {

                console.log(resp);

                if (resp.HasError) {
                    toast.current.show({ severity: "error", summary: "Error", detail: resp.Errors[0], life: 3000 });
                } else {
                    setEmployees((prevEmp) => {
                        return [{ ...resp.Data }, ...prevEmp];
                    });
                    setPopDialog(false);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Employee Created", life: 3000 });
                    setEmpName('');
                    setEmpEmail('');
                    setEmpPassword('');
                    setEmpMobile('');
                    setEmpHQName('');
                    setEmpNumber('');
                    setEmpHQCode('');
                    setCreateStateDropdown(false);
                    setCreateZoneDropdown(false);
                    setCreateRegionDropdown(false);
                    setCreateDesignationDropdown(false);
                    setCheckedIsVisible(false);
                }



            })
            .catch(err => {
                console.log(err);
            });
    };

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </>
    );

    const viewDoctorHandler = (empId) => {
        navigate(`${empId}`);

    };

    const assignDrBody = (rowData) => {
        return <Button label="Doctors" severity="secondary" onClick={() => viewDoctorHandler(rowData.EmpID)} className={classes['view-dr-btn']} />;
    }

    return (
        <>
            <Toast ref={toast} />

            {employees.length === 0 && <SkeletonComp />}

            {employees.length > 0 &&
                <div className={`card ${classes['employee-wrapper']}`}>
                    <DataTable value={employees}
                        paginator rows={50}
                        rowsPerPageOptions={[2, 4, 6, 8, 10]}
                        header={header} editMode="row"
                        onRowEditComplete={onRowEditComplete}
                        showGridlines
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        globalFilterFields={['firstName', 'Email', 'MobileNumber', 'HQName', 'EmpNumber', 'HQCode', 'StateName', 'ZoneName', 'regionName', 'DesignationName']} filters={filters}
                        scrollable
                        selectionMode="single"
                    >
                        <Column field="firstName" header="Name" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="Email" header="Email" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="Password" header="Password" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="MobileNumber" header="Mobile" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="HQName" header="HQ Name" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="EmpNumber" header="Emp Number" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="HQCode" header="HQ Code" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>

                        <Column field="StateName" header="State" body={stateBodyTemplate} editor={(options) => stateEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="ZoneName" header="Zone Name" body={zoneBodyTemplate} editor={(options) => zoneEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="regionName" header="Region Name" body={regionBodyTemplate} editor={(options) => regionEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="DesignationName" header="Designation" body={designationBodyTemplate} editor={(options) => designationEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="isActive" header="Is Active" body={isVisibleHandler} editor={(options) => isVisibleEditor(options)} style={{ width: '20%' }}></Column>
                        <Column header="Action" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="EmpID" header="View Doctors" body={assignDrBody} style={{ width: '20%' }}></Column>
                    </DataTable>
                </div>
            }


            <Dialog visible={popDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Add Employee" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText id="name" value={empName} onChange={(e) => { setEmpName((e.target && e.target.value) || "") }} required autoFocus />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Email</label>
                    <InputText id="name" value={empEmail} onChange={(e) => { setEmpEmail((e.target && e.target.value) || "") }} required autoFocus />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Password</label>
                    <InputText id="name" value={empPassword} onChange={(e) => { setEmpPassword((e.target && e.target.value) || "") }} required autoFocus />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Mobile</label>
                    <InputText id="name" value={empMobile} onChange={(e) => { setEmpMobile((e.target && e.target.value) || "") }} required autoFocus />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">HQ Name</label>
                    <InputText id="name" value={empHQName} onChange={(e) => { setEmpHQName((e.target && e.target.value) || "") }} required autoFocus />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Emp Name</label>
                    <InputText id="name" value={empNumber} onChange={(e) => { setEmpNumber((e.target && e.target.value) || "") }} required autoFocus />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">HQ Code</label>
                    <InputText id="name" value={empHQCode} onChange={(e) => { setEmpHQCode((e.target && e.target.value) || "") }} required autoFocus />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Select State</label>
                    <Dropdown value={createStateDropdown} onChange={(e) => setCreateStateDropdown(e.value)} options={states} optionLabel="StateName" editable placeholder="Select a State" className="w-full" />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Select Zone</label>
                    <Dropdown value={createZoneDropdown} onChange={(e) => setCreateZoneDropdown(e.value)} options={zones} optionLabel="ZoneName" editable placeholder="Select a Zone" className="w-full" />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Select Region</label>
                    <Dropdown value={createRegionDropdown} onChange={(e) => setCreateRegionDropdown(e.value)} options={regions} optionLabel="RegionName" editable placeholder="Select a Region" className="w-full" />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Select Designation</label>
                    <Dropdown value={createDesignationDropdown} onChange={(e) => setCreateDesignationDropdown(e.value)} options={designation} optionLabel="DesignationName" editable placeholder="Select a Designation" className="w-full" />
                </div>

                <div className="flex align-items-center">
                    <Checkbox id='isVisible' onChange={e => { setCheckedIsVisible(e.checked) }} checked={checkedIsVisible}></Checkbox>
                    <label htmlFor="isVisible" className="ml-2">Is Visible</label>
                </div>

            </Dialog>
        </>
    );
};

export default Employee;