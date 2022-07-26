import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import baseUrl from '../../../helpers/baseUrl';

import XMLHttpRequest from 'xhr2';
import filterSearch from '../../../helpers/filterSearch';
import { DataContext } from '../../../store/GlobalState';
import Cookies from 'js-cookie';
function ProductList({ products, result }) {
    const { state, dispatch } = useContext(DataContext)
    const { categories, bulkDeleteData } = state
    // console.log("🚀 ~ file: list.js ~ line 12 ~ categories", categories)
    const router = useRouter();
    const user = Cookies.get('user') && JSON.parse(Cookies.get('user'))
    const [page, setPage] = useState(1)
    const [isCheck, setIsCheck] = useState(false)
    const [checkedProducts, setCheckedProducts] = useState([])
    const handleLoadMore = () => {
        setPage(page + 1)
        filterSearch({ router, page: page + 1 })
    }
    useEffect(() => {
        if (Object.keys(router.query).length === 0) setPage(1)
        else setPage(Number(router.query.page))
    }, [router.query])

    function checkImage(url) {
        // axios.get(url)
        //     .then(res =>
        //     {
        //         return true
        //     }).catch(error =>
        //     {
        //         return false
        //     })
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.send();
        request.onload = function () {
            if (request.status == 200) {
                return true
            } else {
                return false
            }
        }
    }
    let newD = []
    const handleCheckALL = (product) => {
        if (bulkDeleteData.length > 0 && bulkDeleteData.find(x => x._id === product?._id)) {
            dispatch({ type: 'BULK_DELETE', payload: bulkDeleteData.filter(item => item._id !== product?._id) })
        } else {
            dispatch({ type: 'BULK_DELETE', payload: [...bulkDeleteData, product] })
        }
    }

    const handleBulkDelete = () => {
        dispatch({
            type: 'ADD_MODAL',
            payload: {
                data: bulkDeleteData,
                id: '',
                title: 'Delete all selected products?',
                type: 'BULK_DELETE_PRODUCT'
            }
        })
    }
    return (
        <div>
            <div className="alert alert-secondary justify-content-between">
                <div className="text-uppercase">Product List</div>
                <div>Total Product : {result}</div>
            </div>
            <hr />
            <table className='table table-responsive table-hover table-bordered'>
                <thead>
                    <tr>
                        {/* <th></th> */}
                        <th>#Id</th>
                        <th>Title</th>
                        {/* <th>Category</th> */}
                        <th>Image</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product?._id}>
                            {/* <td>
                                <input type="checkbox" onChange={() => handleCheckALL(product)}
                                    style={{ width: '15px', height: '15px', transform: 'translateY(8px)' }} />
                            </td> */}
                            <td>{product?._id}</td>
                            <td>{product?.title}</td>
                            {/* <td>{categories.length > 0 ? categories.find(cat => String(cat._id) === String(product?.category)).name : 'No Category Found'}</td> */}
                            <td>
                                <img src={product?.image ? product?.image : 'https://res.cloudinary.com/x-gwkjs-8zn7m-3/image/upload/v1660200423/no-image-available_bitpsk.png'} alt={product?.title} className="img-thumbnail"
                                    style={{ minWidth: '30px', height: '30px' }} />
                            </td>
                            <td>
                                {
                                    product?.isActive
                                        ? <><i className="far fa-check-circle" style={{ color: 'green' }}></i></>
                                        : <><i className="far fa-times-circle" style={{ color: 'red' }}></i></>
                                }
                            </td>
                            <td style={{ gap: '10px', display: 'flex' }}>
                                <button className='btn btn-sm btn-info'>
                                    <i className="far fa-eye"></i>
                                </button>

                                {user && user.role === 'root' &&
                                    <button className='btn btn-sm btn-danger' onClick={() => dispatch({
                                        type: 'ADD_MODAL',
                                        payload: {
                                            data: product,
                                            _id: product?._id,
                                            title: product?.title,
                                            type: 'DELETE_PRODUCT'
                                        }
                                    })} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                }

                                <button className='btn btn-sm btn-primary'>
                                    <i className="fas fa-pen-nib"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            {bulkDeleteData.length > 1 &&
                <>
                    <button className='btn btn-sm btn-danger' onClick={() => handleBulkDelete()} data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i className="fas fa-trash-alt"></i>&nbsp;Bulk Delete
                    </button>
                </>
            }
            <br />
            {
                result < page * 4 ? ""
                    : <div className='text-center mt-5'>
                        <button className="btn btn-outline-info btn-sm "
                            onClick={handleLoadMore}>
                            <i className="fas fa-spinner"></i>&nbsp; Load more
                        </button>
                    </div>
            }
        </div >
    )
}

export async function getServerSideProps({ query }) {
    const page = query.page || 1
    const category = query.category || 'all'
    const sort = query.sort || ''
    const search = query.search || 'all'

    const res = await fetch(`${baseUrl}/api/products?limit=${page * 4}&category=${category}&sort=${sort}&title=${search}`)


    const data = await res.json()
    if (data.status) {
        const product = data.data
        return {
            props: {
                products: product,
                result: data.total
            }
        }
    }
    return {
        props: {
            products: [],
            result: 0
        }
    }

}

export default ProductList