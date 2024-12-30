import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAuthToken } from '../../util/auth';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import classes from './Doctor.module.css';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { FilterMatchMode } from 'primereact/api';
import SkeletonComp from '../Skelton/Skelton';

const getDoctorData = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/doctor/getall`,
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

const updateDoctor = async (objData) => {
    // console.log(objData)

    const resp = await fetch(`${process.env.REACT_APP_API_URL}/doctor/update`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "PUT",
            body: JSON.stringify({
                doctorID: objData.doctorID,
                customerCode: objData.customerCode,
                doctorName: objData.doctorName,
                specialtyID: objData.specialtyID,
                cityName: objData.cityName,
                stateId: objData.stateId,
                hospitalName: objData.hospitalName,
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

const createRegionData = async (objData) => {

    const resp = await fetch(`${process.env.REACT_APP_API_URL}/doctor/create`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({
                customerCode: objData.doctorCode,
                doctorName: objData.doctorName,
                specialtyID: objData.createSelectSpecility,
                cityName: null,
                stateId: objData.createSelectState,
                hospitalName: objData.createSelectHospital,
                IsActive: objData.checkedCreate
            })
        });

    const respData = await resp.json();
    return respData;
}

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

const Doctor = (props) => {

    const [doctors, setDoctors] = useState([]);

    const [stateDialog, setStateDialog] = useState(false);

    const [hospitalsData, setHospitalsData] = useState([]);
    const [hospitals, setHospitals] = useState([]);

    const [statesData, setStatesData] = useState([]);
    const [states, setStates] = useState([]);

    const [specialityData, setSpecialityData] = useState([]);
    const [specialities, setSpecialities] = useState([]);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedCheckbox, setSelectedCheckbox] = useState(false);

    const [doctorName, setDoctorName] = useState('');
    const [doctorCode, setDoctorCode] = useState('');

    const [checkedCreate, setCheckedCreate] = useState(false);

    //const [createRegion, setCreateRegion] = useState([]);

    const [createSelectSpecility, setCreateSelectSpecility] = useState(false);
    const [createSelectState, setCreateSelectState] = useState(false);
    const [createSelectHospital, setCreateSelectHospital] = useState(false);

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const toast = useRef(null);

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
        getDoctorData()
            .then((res) => {
                console.log(res.Data);
                setDoctors(res.Data);
            })
            .catch(err => {
                console.log(err);
            });

        getHospitalData()
            .then((res) => {
                const hospitalname = res.Data.map((item) => {
                    return item.hospitalname
                });
                setHospitalsData(res.Data);
                setHospitals(hospitalname);
            })
            .catch(err => {
                console.log(err);
            });


        getStateData()
            .then((res) => {
                const stateName = res.Data.map((item) => {
                    return item.StateName
                });
                setStatesData(res.Data);
                setStates(stateName);
            })
            .catch(err => {
                console.log(err);
            });

        getSpecialityData()
            .then((res) => {
                console.log(res);
                const specialtyName = res.Data.map((item) => {
                    return item.specialtyName;
                });
                setSpecialityData(res.Data);
                setSpecialities(specialtyName);
            })
            .catch(err => {
                console.log(err);
            });

    }, []);

    const onRowEditComplete = (e) => {

        let _hospitals = [...doctors];
        let { newData, index } = e;
        _hospitals[index] = newData;
        _hospitals[index].isActive = selectedCheckbox;
        _hospitals[index].IsActive = selectedCheckbox;

        const stateId = statesData.find(item => (item.StateName || '').trim().toLowerCase() === (_hospitals[index].StateName || '').trim().toLowerCase()).StateID;
        const specialitId = specialityData.find(item => (item.specialtyName || '').trim().toLowerCase() === (_hospitals[index].SpecialtyName || '').trim().toLowerCase()).specialtyId;

        _hospitals[index].stateId = stateId;
        _hospitals[index].specialtyID = specialitId;

        if (_hospitals[index]) {
            updateDoctor(_hospitals[index])
                .then(res => {
                    if (res.HasError) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: res.Errors[0], life: 3000 });
                    } else {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Update Successfully', life: 3000 });
                        setDoctors(_hospitals);
                    }
                }).catch((err) => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                });

        }


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

        const objData = {
            doctorName: doctorName,
            doctorCode: doctorCode,
            createSelectSpecility: createSelectSpecility.specialtyId,
            createSelectState: createSelectState.StateID,
            createSelectHospital: createSelectHospital.hospitalname,
            checkedCreate: checkedCreate
        };

        if (objData.doctorName === undefined || objData.doctorName === null || objData.doctorName === '') {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please enter doctors name", life: 3000 });
            return;
        }

        // if (objData.doctorCode === undefined || objData.doctorCode === null || objData.doctorCode === '') {
        //     toast.current.show({ severity: "error", summary: "Error", detail: "Please enter doctors code", life: 3000 });
        //     return;
        // }

        if (!objData.createSelectSpecility) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please select speciality", life: 3000 });
            return;
        }

        if (!objData.createSelectState) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Please select state", life: 3000 });
            return;
        }

        if (!objData.createSelectHospital) {
            objData.createSelectHospital = '';
        }

        console.log(objData);

        createRegionData(objData)
            .then(res => {
                const resp = res.Data;

                console.log(res);

                if (res.HasError) {
                    toast.current.show({ severity: "error", summary: "Failed", detail: res.Errors[0], life: 3000 });
                } else {
                    setDoctors((prevDr) => {
                        const respData = {
                            doctorID: resp.doctorID,
                            customerCode: resp.customerCode,
                            doctorName: resp.doctorName,
                            specialtyID: resp.specialtyID,
                            SpecialtyName: resp.SpecialtyName,
                            cityName: resp.cityName,
                            stateId: resp.stateId,
                            StateName: resp.StateName,
                            hospitalName: resp.hospitalName,
                            IsActive: resp.IsActive,
                            CreatedDate: resp.CreatedDate,
                        };
                        return [{ ...respData }, ...prevDr];
                    });

                    setStateDialog(false);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Doctor Created", life: 3000 });
                    setDoctorName('');
                    setDoctorCode('');
                    setCreateSelectSpecility(false);
                    setCreateSelectState(false);
                    setCreateSelectHospital(false);
                    setCheckedCreate(false)
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

    const onDrNameHandler = (e, name) => {
        const val = (e.target && e.target.value) || "";
        setDoctorName(val);
    };

    const onDrCodeHandler = (e, name) => {
        const val = (e.target && e.target.value) || "";
        setDoctorCode(val);
    };

    const header = (
        <>
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h1 className="m-0 text-2xl font-bold">Doctor</h1>
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

    const selectedHospitalTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };


    const hospitalEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={hospitals}
                placeholder="Select a Hospital"
                filter valueTemplate={selectedHospitalTemplate}
                onChange={(e) => {
                    options.editorCallback(e.value);
                }}
                itemTemplate={(option) => {
                    return <span>{option}</span>
                }}
            />
        );
    };

    const hospitalBodyTemplate = (rowData) => {
        return <span>{rowData.hospitalName}</span>;
    };


    const stateBodyTemplate = (rowData) => {
        return <span>{rowData.StateName}</span>;
    };

    const selectedStateTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const stateEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={states}
                placeholder="Select a State"
                onChange={(e) => { options.editorCallback(e.value) }}
                filter valueTemplate={selectedStateTemplate}
                itemTemplate={(option) => {
                    return <span>{option}</span>
                }}
            />
        );
    };


    const selectedSpecialityTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const specialityBodyTemplate = (rowData) => {
        return <span>{rowData.SpecialtyName}</span>;
    };

    const specialityEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={specialities}
                placeholder="Select a Speciality"
                filter valueTemplate={selectedSpecialityTemplate}
                onChange={(e) => {
                    options.editorCallback(e.value);
                }}
                itemTemplate={(option) => {
                    return <span>{option}</span>
                }}
            />
        );
    };

    const isVisibleHandler = (rowData) => {
        console.log(rowData.IsActive)
        return <Checkbox value={rowData.IsActive} checked={rowData.IsActive}></Checkbox>;
    };



    const isVisibleEditor = (options) => {
        // if (options.rowData) {
        //     console.log(options)
        //     setIsVisible(options.rowData.IsActive);
        // }
        return <Checkbox onChange={e => { checkBoxHandler(e); }} checked={isVisible} ></Checkbox>;
    };

    const checkBoxHandler = (obj) => {
        setIsVisible(obj.checked);
        setSelectedCheckbox(obj.checked);
    }

    const createSelectedSpecialityTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.specialtyName}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const createSelectedSpecialityOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.specialtyName}</div>
            </div>
        );
    };

    const createSelectedStateTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.StateName}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const createSelectedStateOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.StateName}</div>
            </div>
        );
    };

    const createSelectedHospitalTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.hospitalname}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const createSelectedHospitalOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.hospitalname}</div>
            </div>
        );
    };

    return (
        <>
            <Toast ref={toast} />

            {doctors.length === 0 && <SkeletonComp />}

            {doctors.length > 0 &&
                <div className={`card ${classes['doctor-wrapper']}`}>
                    <DataTable value={doctors}
                        paginator rows={50}
                        rowsPerPageOptions={[2, 4, 6, 8, 10]}
                        header={header} editMode="row"
                        onRowEditComplete={onRowEditComplete}
                        showGridlines
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        globalFilterFields={['doctorName', 'SpecialtyName']}
                        filters={filters}
                        selectionMode="single"
                    >
                        <Column field="doctorName" header="Name" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="customerCode" header="Code" editor={(options) => textEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="SpecialtyName" header="Speciality" body={specialityBodyTemplate} editor={(options) => specialityEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="StateName" header="State" body={stateBodyTemplate} editor={(options) => stateEditor(options)} style={{ width: '100%' }} ></Column>
                        <Column field="hospitalName" header="Hospital" body={hospitalBodyTemplate} editor={(options) => hospitalEditor(options)} style={{ width: '100%' }}></Column>
                        <Column field="isActive" header="Is Visible" body={isVisibleHandler} editor={(options, rowData) => isVisibleEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="LinkedWithEmployee" header="Employee" style={{ width: '20%' }}></Column>
                        <Column header="Action" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
                </div>
            }


            <Dialog visible={stateDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Add Doctor" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label>
                    <InputText id="name" value={doctorName} onChange={(e) => onDrNameHandler(e)} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Code</label>
                    <InputText id="name" value={doctorCode} onChange={(e) => onDrCodeHandler(e)} required autoFocus />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Select Sepciality</label>
                    <Dropdown
                        value={createSelectSpecility}
                        onChange={(e) => setCreateSelectSpecility(e.value)}
                        options={specialityData}
                        optionLabel="specialtyName"
                        editable
                        placeholder="Select a Speciality"
                        className="w-full"
                        filter
                        valueTemplate={createSelectedSpecialityTemplate}
                        itemTemplate={createSelectedSpecialityOptionTemplate}
                    />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Select State</label>
                    <Dropdown
                        value={createSelectState}
                        onChange={(e) => setCreateSelectState(e.value)}
                        options={statesData}
                        optionLabel="StateName"
                        editable
                        placeholder=" Select a State"
                        className="w-full"
                        filter
                        valueTemplate={createSelectedStateTemplate}
                        itemTemplate={createSelectedStateOptionTemplate}
                    />
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Select Hospital</label>
                    <Dropdown
                        value={createSelectHospital}
                        onChange={(e) => setCreateSelectHospital(e.value)}
                        options={hospitalsData}
                        optionLabel="hospitalname"
                        editable
                        placeholder=" Select a Hospital"
                        className="w-full"
                        filter
                        valueTemplate={createSelectedHospitalTemplate}
                        itemTemplate={createSelectedHospitalOptionTemplate}
                    />
                </div>

                <div className="flex align-items-center">
                    <Checkbox id='isVisible' onChange={e => { setCheckedCreate(e.checked) }} checked={checkedCreate}></Checkbox>
                    <label htmlFor="isVisible" className="ml-2">Is Visible</label>
                </div>
            </Dialog>
        </>
    );
};

export default Doctor;