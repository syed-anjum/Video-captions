import React, { useState, useRef, useEffect } from 'react';
import { withMask } from 'use-mask-input';
import WebVTT from "node-webvtt";

export default function UrlBox() {
    return (
        <div className='w-100'>
            <form className="d-flex flex-column justify-content-center align-items-center gap-4" onSubmit={viewVideo}>
                <input class="form-control" id="urltext" placeholder="Enter Video URL" value={videoSrc} onChange={handleURLChange} />
                <button type="submit" class="btn btn-outline-primary" >Submit</button>
            </form>
        </div>
    );
}