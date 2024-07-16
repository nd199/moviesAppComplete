import {React, useEffect} from "react";
import "./ProductList.css";
import {DataGrid} from "@mui/x-data-grid";
import {DeleteOutlineOutlined, EditOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteProduct, fetchProducts} from "../redux/ApiCalls";
import {format} from "date-fns";

const ProductList = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.product.products);

    useEffect(() => {
        fetchProducts(dispatch);
    }, [dispatch]);

    const fetchProductList = () => {
        fetchProducts(dispatch);
    };

    const deleteProductHandler = async (id) => {
        const productToBeDeleted = items?.find(
            (product) => Number(product.id) === id
        );
        const productType = productToBeDeleted.type;
        let entityId;
        if (productType === "movies") {
            entityId = productToBeDeleted?.movie_id;
        } else if (productType === "shows") {
            entityId = productToBeDeleted?.show_id;
        }
        try {
            await deleteProduct(entityId, productType, dispatch);
            fetchProductList();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    const columns = [
        {field: "id", headerName: "ID", width: 70},
        {
            field: "name",
            headerName: "ProductName",
            width: 230,
            renderCell: (params) => {
                return (
                    <div className="plProduct">
                        <img
                            className="plImg"
                            src={params.row.poster && "/images/REGBack.jpg"}
                        />
                        {params.row.name}
                    </div>
                );
            },
        },
        {field: "type", headerName: "TYPE(Movie/Show)", width: 200},
        {
            field: "cost",
            headerName: "Price",
            sortable: false,
            width: 160,
            renderCell: (params) => {
                return (
                    <div>
                        <p>&#8377; {params.row.cost}</p>
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
                    <div className="plActions">
                        <Link to={"/Product/" + params.row.id}>
                            <EditOutlined className="plEdit"/>
                        </Link>
                        <DeleteOutlineOutlined
                            className="plDelete"
                            onClick={() => deleteProductHandler(params.row.id)}
                        />
                    </div>
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Created On",
            width: 200,
            renderCell: (params) => {
                return (
                    <div>
                        {format(new Date(params.row.createdAt), "MMMM dd, yyyy HH:mm")}
                    </div>
                );
            },
        },
        {
            field: "updatedAt",
            headerName: "Last Updated",
            width: 200,
            renderCell: (params) => {
                return (
                    <div>
                        {format(new Date(params.row.updatedAt), "MMMM dd, yyyy HH:mm")}
                    </div>
                );
            },
        },
    ];
    return (
        <div className="productListPage">
            <div className="create">
                <Link to="/NewProduct">
                    <button className="productAdd">Create</button>
                </Link>
            </div>
            <div className="productList" style={{overflow: "scroll"}}>
                <DataGrid
                    rows={items}
                    disableRowSelectionOnClick
                    columns={columns}
                    getRowId={(row) => row.id}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 50},
                        },
                    }}
                    pageSizeOptions={[20]}
                    checkboxSelection
                />
            </div>
        </div>
    );
};

export default ProductList;
