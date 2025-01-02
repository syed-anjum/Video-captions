import React, { useState, useRef, useEffect } from 'react';
import { withMask } from 'use-mask-input';
import WebVTT from "node-webvtt";

export default function Captions() {
    return (
        <div className='d-flex flex-column align-items-center bg-secondary-subtle mt-3 w-100'>
            <div className='m-2 bg-light w-75 overflow-y-auto' style={{ height: 225 }}>
                <div className='w-100'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th scope="col">Time</th>
                                <th scope="col">Subtitle</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(captionsobject).map((key, index) => (
                                <tr key={key}>
                                    <td> {secondsToTime(key)}</td>
                                    <td className='text-break w-50'>{captionsobject[key].text}</td>
                                    <td><button type="button" class="btn btn-outline-primary" onClick={() => deleteCaption(key)}>Delete</button></td>
                                </tr>

                            ))}
                        </tbody>

                    </table>

                </div>

            </div>
            <button type="button" class="btn btn-outline-primary m-2 w-50" onClick={showVideoWithCaptions} >View Video with Captions</button>
        </div>
    );
}