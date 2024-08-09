import { useState } from 'react'
import React from 'react';
import Task from '../components/Task';
function ContainerBlock({date, DeleteTask,Executed,ChangeTitle, ChangeDate, minDate}) {
    return (
        <>
            <div className="category_card">
                <p className="category_title">{date[0].type}</p>
                <p className="quantity_of_tasks">{date.length}</p>
                <div className="tasks">
                {date.map(item => <Task date_task={item} DeleteTask={DeleteTask} Executed={Executed} ChangeTitle={ChangeTitle} ChangeDate={ChangeDate} minDate={minDate}></Task>)}
                </div>
            </div>
        </>
    )
}
export default ContainerBlock;