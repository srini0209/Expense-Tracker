'use client'
import RadioGroup from '../../../components/Inputs/RadioGroup.js'
import Input from '../../../components/Inputs/Input.js'
import Form from 'next/form'
import React, { useState } from 'react'
import DateTimePicker from '../../../components/Inputs/DateTimePicker.js'

const page = () => {

    const [amount, setAmount] = useState(Number);
    const [desc, setDesc] = useState("");
    const [date, setDate] = useState(null);


    const submiHandler = async () => {

    }
    return (
        <div className='w-[60%] mx-auto my-20'>
            <h1 className='text-4xl text-black font-bold mb-10'>Add Transaction</h1>

            <Form onSubmit={submiHandler}>
                <RadioGroup title={"Transaction Type"} values={['Expense', 'Income']} />
                <Input label={"Amount"}
                    type={"Number"}
                    placeholder={"Enter Amount"}
                    prefix={"$"}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
                <Input label={"Description"}
                    type={"text"}
                    placeholder={"Enter Description"}
                    value={desc}
                    onChange={(e) => setDesc(Number(e.target.value))}
                />
               <DateTimePicker value={date} onChange={(e)=>setDate(e.target.value)} />
            </Form>
        </div>
    )
}

export default page