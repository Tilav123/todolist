import { useState } from 'react'
import React from 'react';
function Task({ date_task, DeleteTask, Executed, ChangeTitle, ChangeDate, minDate }) {
    return (
        <>
            <div className="task">
                <div className="left_part_of_task">
                    <input type="checkbox" name={date_task.id} className='checkbox_of_left_part' checked={date_task.executed} onClick={() => Executed(date_task.id, !date_task.executed)} />
                    <div className="child_of_left_part">
                        <input type="text" className={`title_task ${date_task.executed == true ? "strikethrough" : ""}`} value={date_task.name} onChange={(e) => ChangeTitle(date_task.id, e.target.value)} />
                        <p className="date_task">Due: {date_task.date}</p>
                    </div>
                </div>
                <div className="right_part_of_task">
                    <input type="date" className='icon change_date2' value={date_task.date} onChange={(e) => ChangeDate(date_task.id, e.target.value)} min={minDate} />
                    <img src="/bin.png" alt="" className="icon" onClick={() => DeleteTask(date_task.id)} />
                </div>
            </div>
        </>
    )
}
export default Task;