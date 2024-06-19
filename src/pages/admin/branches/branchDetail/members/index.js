import Loading from "components/loading";
import Empty from "components/empty";
import React from "react";
import useGetDataList from "hooks/useGetDataList";

export default function Members(props) {

    const {shopId} = props;

    const urlMembers = '/employee';
    // eslint-disable-next-line
    const [members, metaMembers, isLoadingMembers, setMembers, setMetaMembers, setIsLoadingMembers] = useGetDataList(
        urlMembers, null, null, {
            shop_id: shopId
        }, ''
    );

    return (
        <>
            <div className="mt-4 dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-4/12 px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="w-4/12 px-6 py-3">
                            លេខទូរស័ព្ទ
                        </th>
                        <th scope="col" className="w-2/12 px-6 py-3">
                            តួនាទី
                        </th>
                        {/*<th scope="col" className="text-center w-2/12 px-6 py-3 rounded-r-lg">*/}
                        {/*    សកម្មភាព*/}
                        {/*</th>*/}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoadingMembers
                        ? null
                        : members.map(member => (
                            <tr className="h-14 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <img className="w-10 h-10 rounded-md object-cover"
                                         src={
                                             member.img_url || 'https://ui-avatars.com/api/?name=' + member.name + '&background=random&color=fff'
                                         } alt={member.name}/>
                                    <div className="pl-3">
                                        <div className="text-base font-semibold">{member.name}</div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    {member.phone}
                                </td>
                                <td className="px-6 py-4">
                                    {member.role === "admin" ? (
                                        "ម្ចាស់ហាង"
                                    ) : member.role === "manager" ? (
                                        "អ្នកគ្រប់គ្រង"
                                    ) : member.role === "sale" ? (
                                        "អ្នកលក់"
                                    ) : (
                                        "សមាជិក"
                                    )}
                                </td>
                                {/*<td className="px-6 py-4">*/}
                                {/*</td>*/}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isLoadingMembers
                ? <Loading/>
                : members.length === 0
                    ? <Empty title="សមាជិក"/>
                    : <div className="flex-1"></div>
            }
        </>
    )
}