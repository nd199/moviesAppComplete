import React, {useEffect} from "react";
import "./UserList.css";
import {DataGrid} from "@mui/x-data-grid";
import {DeleteOutlineOutlined, EditOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, fetchUsers} from "../redux/ApiCalls";

const UserList = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);
    console.log(users);

    useEffect(() => {
        const res = fetchUsers(dispatch);
        console.log(res);
    }, [dispatch]);

    const fetchUserList = () => {
        fetchUsers(dispatch);
    };

    const deleteUserHandler = async (id) => {
        try {
            await deleteUser(id, dispatch);
            fetchUserList();
        } catch (err) {
            console.log(err);
        }
    };

    const columns = [
        {field: "id", headerName: "ID", width: 220},
        {
            field: "username",
            headerName: "User",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="ulUser">
                        <img className="ulImg" src={params.row.avatar} alt="User Avatar"/>
                    </div>
                );
            },
        },
        {field: "email", headerName: "Email", width: 200},
        {
            field: "isLogged",
            headerName: "Online Status",
            width: 200,
            renderCell: (params) => {
                return (
                    <div
                        style={{
                            color: params.row.isLogged ? "green" : "red",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        {params.row.isLogged ? "Online" : "Not Online"}
                    </div>
                );
            },
        },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="ulActions">
                        <Link to={"/User/" + params.row.id}>
                            <EditOutlined className="ulEdit"/>
                        </Link>
                        <DeleteOutlineOutlined
                            className="ulDelete"
                            onClick={() => deleteUserHandler(params.row.id)}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="ulist">
            <DataGrid
                rows={users}
                disableRowSelectionOnClick
                columns={columns}
                getRowId={(row) => row.id}
                pageSize={5}
                checkboxSelection
                headerClassName="header-class"
            />
        </div>
    );
};

export default UserList;
