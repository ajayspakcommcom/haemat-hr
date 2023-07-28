import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAuthToken } from '../../util/auth';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import classes from './EmployeeItem.module.css';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { Toolbar } from 'primereact/toolbar';

const deleteDoctor = async (empId, drId) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/empdoc/delete`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "DELETE",
            body: JSON.stringify({ empID: empId, doctorID: drId })
        });
    const data = await resp.json();
    return data;
}

const assignDoctor = async (empId, drId) => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/empdoc/create`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            method: "POST",
            body: JSON.stringify({ EmpID: empId, doctorID: drId })
        });
    const data = await resp.json();
    return data;
}

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

const EmployeeItem = ({ data, empId, onToggleData, isAssignedDr }) => {

    const [drData, setDrData] = useState([]);
    const [selectedDoctors, setSelectedDoctors] = useState(null);
    const [deleteDoctorsDialog, setDeleteDoctorsDialog] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const selectedEmployeeTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.firstName}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const employeeOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.firstName}</div>
            </div>
        );
    };

    const toast = useRef(null);

    useEffect(() => {
        setDrData(data);

        getEmployeeData()
            .then((res) => {
                console.log(res.Data)
                setEmployees(res.Data)
            })
            .catch(err => {
                console.log(err);
            });

    }, [data]);

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
        </div>
    );

    const hidedeleteDoctorsDialog = () => {
        setDeleteDoctorsDialog(false);
    };

    const confirmDeleteSelected = () => {
        setDeleteDoctorsDialog(true);
    };

    const deleteSelectedDoctors = () => {
        let _doctors = drData.filter((val) => !selectedDoctors.includes(val));
        setDrData(_doctors);
        setDeleteDoctorsDialog(false);
        setSelectedDoctors(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });

        console.log(selectedDoctors);

        for (const item of selectedDoctors) {
            //console.log(empId);
            //console.log(item.doctorID);
            deleteDoctor(empId, item.doctorID);
        }
    };

    const assignSelectedDoctors = () => {
        let _doctors = drData.filter((val) => !selectedDoctors.includes(val));
        setDrData(_doctors);
        setDeleteDoctorsDialog(false);
        setSelectedDoctors(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });

        console.log(selectedDoctors);

        for (const item of selectedDoctors) {
            assignDoctor(empId, item.doctorID);
        }
    };

    const transferDoctorHandler = () => {
        let _doctors = drData.filter((val) => !selectedDoctors.includes(val));
        setDrData(_doctors);
        setSelectedDoctors(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });


        console.log(selectedDoctors);
        console.log(selectedEmployee);

        for (const item of selectedDoctors) {
            deleteDoctor(empId, item.doctorID);
            assignDoctor(selectedEmployee.EmpID, item.doctorID);
        }

    };

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedDoctors(value);
        console.log(selectedDoctors)
    };

    const toggleHandler = () => {
        onToggleData();
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <div className='flex gap-2'>
                    {!isAssignedDr && <Button label="Back" icon="pi pi-arrow-left" severity="secondary" onClick={toggleHandler} />}
                    {!isAssignedDr && <Button label="Assign" icon="pi pi-plus" severity="success" onClick={assignSelectedDoctors} disabled={!selectedDoctors || !selectedDoctors.length} />}
                    {isAssignedDr && <Button label="Assign Doctor" icon="pi pi-plus" severity="success" onClick={toggleHandler} />}
                    {isAssignedDr && <Button label="Delete Doctor" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedDoctors || !selectedDoctors.length} />}

                    {isAssignedDr &&
                        <div>
                            <div className="card flex justify-content-center">
                                <Dropdown
                                    value={selectedEmployee}
                                    onChange={(e) => { setSelectedEmployee(e.value); console.log(selectedEmployee) }}
                                    options={employees}
                                    optionLabel="firstName"
                                    placeholder="Assign Doctor To Employee"
                                    filter valueTemplate={selectedEmployeeTemplate}
                                    itemTemplate={employeeOptionTemplate}
                                    className="w-full md:w-14rem"
                                    disabled={!selectedDoctors || !selectedDoctors.length}
                                />
                            </div>
                        </div>
                    }
                    {isAssignedDr && <Button label="Go" disabled={!selectedEmployee} onClick={transferDoctorHandler} />}
                </div>
            </div>
        );
    };

    const deleteDoctorsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hidedeleteDoctorsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedDoctors} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />
            <div className={`card ${classes['employee-wrapper']}`}>
                <Toolbar className={`mb-4 w-full`} left={leftToolbarTemplate}></Toolbar>
                <DataTable value={drData} paginator rows={10} rowsPerPageOptions={[2, 4, 6, 8, 10]} selection={selectedDoctors} onSelectionChange={onSelectionChange}>
                    <Column selectionMode="multiple" />
                    <Column field="doctorName" header={isAssignedDr ? 'Assigned Doctor' : 'Unassigned Doctor'} style={{ width: '95%' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={deleteDoctorsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDoctorsDialogFooter} onHide={hidedeleteDoctorsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>Are you sure you want to delete the selected Doctors?</span>
                </div>
            </Dialog>
        </>
    );
};

export default EmployeeItem;