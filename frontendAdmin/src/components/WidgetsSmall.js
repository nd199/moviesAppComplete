import React, {useEffect, useState} from "react";
import "./WidgetsSmall.css";
import {VisibilityOutlined} from "@mui/icons-material";
import {userRequest} from "../AxiosMethods";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const WidgetsSmall = () => {
    const usersState = useSelector((state) => state?.user?.users);

    const [users, setUsers] = useState(usersState || "");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const defaultUserPicture = [
        "https://firebasestorage.googleapis.com/v0/b/moviesite-5ed22.appspot.com/o/christian-buehner-DItYlc26zVI-unsplash.jpg?alt=media&token=f1deb5ac-78ee-4a8f-8337-f9ba956e87ea",
        "https://firebasestorage.googleapis.com/v0/b/moviesite-5ed22.appspot.com/o/michael-dam-mEZ3PoFGs_k-unsplash.jpg?alt=media&token=1d499901-1596-458c-9f52-6dd9a7c985b2",
    ];
    const defaultSelected =
        defaultUserPicture[Math.floor(Math.random() * defaultUserPicture.length)];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userRequest().get("/customers?new=true");
                setUsers(response.data);
            } catch (err) {
                setError("Failed to fetch users");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="widgetSmall">
            <span className="wsTitle">Newly Joined Members</span>
            {loading ? (
                <div className="loading">
                    <p>Loading...</p>
                </div>
            ) : error ? (
                <div className="error">
                    <p>{error}</p>
                </div>
            ) : (
                <ul className="wsList">
                    {users?.length > 0 ? (
                        users?.filter(user => user.roles[0] !== 'ROLE_ADMIN').map((user) => (
                            <li className="wsListItem" key={user.id}>
                                <img
                                    src={user?.imageUrl || defaultSelected}
                                    alt=""
                                    className="wsImage"
                                />
                                <div className="wsUser">
                                    <span className="wsUsername">{user.username}</span>
                                    <span className="wsUserTitle">{user.name || "No Title"}</span>
                                </div>
                                <button className="wsButton">
                                    <VisibilityOutlined className="ws-icon"/>
                                    <Link to={"/User/" + user.id} style={{color: "violet"}}>
                                        Display
                                    </Link>
                                </button>
                            </li>
                        ))
                    ) : (
                        <div className="loading">
                            <p>No Users Found</p>
                        </div>
                    )}
                </ul>
            )}
        </div>
    );
};

export default WidgetsSmall;
