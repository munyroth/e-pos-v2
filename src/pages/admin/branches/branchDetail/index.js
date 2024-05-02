import {useParams} from "react-router";
import useGetDataObject from "../../../../hooks/useGetDataObject";
import {Link} from "react-router-dom";
import React from "react";

export default function BranchDetail() {

    const {id} = useParams();

    let url = '/shop/'+id;
    // eslint-disable-next-line
    const [branch, isLoading, setBranch, setIsLoading] = useGetDataObject(url);

    return (
        <div className="dark:text-white">
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    {/*<h1 className="me-8">សាខា</h1>*/}
                    <Link
                        to="/admin/branches"
                        className="">
                <span
                    className="text-main self-center text-xl font-semibold whitespace-nowrap sm:text-2xl">ថយក្រោយ</span>
                    </Link>
                </div>
            </div>

            ឈ្មោះហាង : {branch.name}
        </div>
    )
}