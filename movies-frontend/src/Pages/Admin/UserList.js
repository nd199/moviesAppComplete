import React, {useEffect} from "react";
import "./UserList.css";
import {DataGrid} from "@mui/x-data-grid";
import {DeleteOutlineOutlined, EditOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, fetchUsers} from "../../Network/ApiCalls";
import {format} from "date-fns";

const UserList = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state?.user?.users.filter(user => user.roles[0] !== 'ROLE_ADMIN'));

    const defaultUserPicture = [
        "https://picsum.photos/seed/user1/100/100.jpg",
        "https://picsum.photos/seed/user2/100/100.jpg",
    ];
    const defaultSelected =
        defaultUserPicture[Math.floor(Math.random() * defaultUserPicture.length)];

    useEffect(() => {
        fetchUsers(dispatch);
    }, [dispatch]);

    const fetchUserList = () => {
        fetchUsers(dispatch);
    };

    const deleteUserHandler = async (id) => {
        try {
            await deleteUser(id, dispatch);
            fetchUserList();
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    };

    const columns = [
        {field: "id", headerName: "ID", width: 100},
        {
            field: "imageUrl",
            headerName: "User",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="ulUser">
                        <img
                            className="ulImg"
                            src={params.row.imageUrl || defaultSelected}
                            alt="User Avatar"
                        />
                        {params.row.name}
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
                            color: (params.row.isLogged || params.row.isRegistered) ? "green" : "red",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        {(params.row.isLogged || params.row.isRegistered) ? "Online" : "Not Online"}
                    </div>
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Created On",
            width: 200,
            renderCell: (params) => {
                const createdAtDate = params.row.createdAt
                    ? new Date(params.row.createdAt)
                    : null;
                return (
                    <div>
                        {createdAtDate && !isNaN(createdAtDate.getTime())
                            ? format(createdAtDate, "MMMM dd, yyyy HH:mm")
                            : "Invalid Date"}
                    </div>
                );
            },
        },
        {
            field: "updatedAt",
            headerName: "Last Updated",
            width: 200,
            renderCell: (params) => {
                const updatedAtDate = params.row.updatedAt
                    ? new Date(params.row.updatedAt)
                    : null;
                return (
                    <div>
                        {updatedAtDate && !isNaN(updatedAtDate.getTime())
                            ? format(updatedAtDate, "MMMM dd, yyyy HH:mm")
                            : "Invalid Date"}
                    </div>
                );
            },
        },
        {
            field: "action",
            headerName: "Profile Actions",
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="ulActions">
                        <Link to={"/admin/users/" + params.row.id}>
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
