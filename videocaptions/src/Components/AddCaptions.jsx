import React, { useState, useRef, useEffect } from 'react';
import { withMask } from 'use-mask-input';
import WebVTT from "node-webvtt";

export default function AddCaptions() {

    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100">
            <form onSubmit={addCaptions} className='w-100 d-flex flex-column gap-2'>
                <div className='d-flex gap-2 justify-content-between'>

                    <input type="text" ref={withMask('99:99:99')} value={startTime} onChange={handleStartTimeChange} placeholder='Enter Start Time' />

                    <div>to</div>
                    <input type="text" value={endTime} ref={withMask('99:99:99')} onChange={handleEndTimeChange} placeholder='Enter End Time' />
                </div>

                <div className="w-100">
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" value={captions} onChange={handleCaptionChange}></textarea>
                </div>

                <button type="submit" class="btn btn-outline-primary w-50">Add Caption</button>
                <div>{error}</div>
            </form>

        </div>
    )
}