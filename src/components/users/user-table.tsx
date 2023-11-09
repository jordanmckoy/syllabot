import { UserTableProps } from "@/types/types";
import Link from "next/link";
import React from "react";

export const UserTable = (props: UserTableProps) => {
    return (
        <div>
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.userProgressRows.map((row) =>
                        <tr key={row.id}>
                            <td>
                                <div className="flex items-center space-x-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            {row.image && (<img src={row.image} alt="Avatar Tailwind CSS Component" />)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">{row.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="text-sm opacity-50">{row.email}</div>
                            </td>
                            <th>
                                <Link href={`/admin/users/${row.id}`}><button className="btn">View</button></Link>
                            </th>
                        </tr>)}

                </tbody>
                {/* foot */}
                <tfoot>
                    <tr>
                        <th>Name</th>
                        <th>Progress</th>
                    </tr>
                </tfoot>

            </table>
        </div>
    )
}