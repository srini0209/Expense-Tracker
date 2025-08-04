import Link from 'next/link';
import React from 'react';
import TransactionsModel from '../../../../models/TransactionsModel';

const page = async () => {

    const txns = await TransactionsModel.find();



    return (
        <div className='w-[60%] mx-auto my-20'>
            <div className='flex flex-row text-black justify-between'>
                <h2 className='text-4xl font-bold '>Transactions</h2>
                <Link href={"/transactions/add"} className='bg-slate-50 border-slate-400 px-4 py-2 items-center rounded-lg font-medium text-[#3c32ff] ' >
                    Add Transaction
                </Link>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <td>Date  </td>
                            <td>Category  </td>
                            <td>Description  </td>
                            <td>Amount  </td>
                        </tr>
                    </thead>
                    <tbody>
                        {txns.length > 0 && (
                            txns.map((txn) => (
                                <tr>
                                    <td> {txn.date.format('d-m-Y')} </td>
                                    <td> {txn.category} </td>
                                    <td> {txn.description} </td>
                                    <td> ₹{txn.amount} </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default page;