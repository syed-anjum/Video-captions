import React, { useState, useRef, useEffect } from 'react';
import { withMask } from 'use-mask-input';
import WebVTT from "node-webvtt";
import ReactPlayer from 'react-player'

function Page() {

    const [video,setVideo]=useState(0);
    const [videoSrc, setVideoSrc] = useState("");
    const [subtitleSrc, setSubtitleSrc] = useState();
    const [videoLength, setVideoLength] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [captions, setCaptions] = useState('');
    var [startTimings, setStartTimings] = useState([]);
    const [captionsobject, setCaptionsobject] = useState({});
    const [subtitles, setSubtitles] = useState([]);
    const [error, setError] = useState('');
    const videoRef = useRef(null);



    const handleStartTimeChange = ({ target: { value } }) => {
        setStartTime(value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const handleCaptionChange = (e) => {
        setCaptions(e.target.value);
    };

    const handleURLChange=(e)=>{
        setVideoSrc(e.target.value);
    }
    const changeUrl=(e)=>{
        setVideoSrc('');
        setVideo(0);
        setCaptionsobject({});
        setSubtitles([]);
        setStartTime('');
        setEndTime('');
        setCaptions("");
    }
    const viewVideo=()=>{
        setVideoSrc(videoSrc);
        setVideo(1);
    }
    const secondsToTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        return formattedTime;
    };

    const convertToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const searchTime = (time) => {
        let left = 0;
        let right = startTimings.length - 1;
        let floor = -1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (startTimings[mid] === time) {
                return startTimings[mid];
            } else if (startTimings[mid] < time) {
                floor = startTimings[mid];
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return floor;
    }


    const addCaptions = (e) => {
        e.preventDefault();
        
        var intStartTime = parseInt(convertToSeconds(startTime));
        var nearestSecondsCaption = searchTime(intStartTime);
        if (startTime.length == 0 || endTime.length == 0) {
            setError("Fill all fields");
            return;
        }
        if (Object.keys(captionsobject).length != 0 && captionsobject[nearestSecondsCaption].hasOwnProperty('endTime') && (nearestSecondsCaption == intStartTime || (nearestSecondsCaption < intStartTime && intStartTime < parseInt(captionsobject[nearestSecondsCaption].endTime)))) {
            setError("Caption is already present at given time");
            return;
        }
        else if(videoRef.current.duration < convertToSeconds(endTime)){
            setError("Video Duration is less than End time",endTime);
            return;
        }
        else {
            setError("");
        }

        startTimings.push(intStartTime);
        startTimings = startTimings.sort();
        setStartTimings(startTimings);

        const newSubtitle = {
            startTime: intStartTime,
            endTime: convertToSeconds(endTime),
            text: captions,
        };

        captionsobject[intStartTime] = newSubtitle;
        setCaptionsobject(captionsobject);
        setSubtitles([...subtitles, newSubtitle]);
        setStartTime(endTime);
        setEndTime('');
        setCaptions("");
    };

    const deleteCaption=(time)=>{
        var id=startTimings.indexOf(time);
        startTimings.splice(id, 1);
        setStartTimings(startTimings);
        const updatedObj = Object.fromEntries(
            Object.entries(captionsobject).filter(([key]) => key !== time)
          );
        setCaptionsobject(updatedObj);
        var removeIndex=0;
        for (let index = 0; index < subtitles.length; index++) {
            if(subtitles[index].startTime==time){
                removeIndex=index;
            }
        }
        subtitles.splice(removeIndex,1);
        setSubtitles(subtitles);
        console.log(subtitles);
    }

    
    const showVideoWithCaptions = () => {
        const parsedSubtitle = {
            cues: [],
            valid: true,
        };

        subtitles.forEach((subtitle, index) => {
            const cue = {
                identifier: (index + 1).toString(),
                start: subtitle.startTime,
                end: subtitle.endTime,
                text: subtitle.text,
                styles: "",
            };
            parsedSubtitle.cues.push(cue);
        });

        const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);
        const modifiedSubtitleBlob = new Blob([modifiedSubtitleContent], {
            type: "text/vtt",
        });
        const downloadLink = URL.createObjectURL(modifiedSubtitleBlob);
        const a = document.createElement("a");
        a.href = downloadLink;
        a.download = "subtitles.vtt";
        setSubtitleSrc(a);
        
        videoRef.current.currentTime=0;
        videoRef.current.play();
        
        //  var track= 
        // setTrack(track);
        // videoRef.current.seekTo(0);
        // videoRef.current.playing=true;
    };

    return (

        <div className="w-100 h-100 container pt-5">
            <div className="d-flex flex-column align-items-center">
                {

                    video == 0 ? <div className='w-100'>
                        <form className="d-flex flex-column justify-content-center align-items-center gap-4" onSubmit={viewVideo}>
                            <input  class="form-control" id="urltext" placeholder="Enter Video URL" value={videoSrc} onChange={handleURLChange} />
                            <button type="submit" class="btn btn-outline-primary" >Submit</button>
                        </form>
                    </div>

                        :
                        <div className='d-flex flex-column align-items-center justify-content-center mt-3'>
                            <button type="button" class="btn btn-outline-primary" onClick={changeUrl} >Change URL</button>
                            <div className="d-flex align-items-center justify-content-center mt-5 gap-4">
                                <div className='w-100 h-100'>
                                {/* <ReactPlayer
                                    controls={true}
                                    url={videoSrc}
                                    config={{ file: {
                                        tracks: [
                                            {kind: 'subtitles', src: subtitleSrc, srcLang: 'en', default: true}
                                        ],
                                    },}}
                                />
                                <source src={videoSrc} type="video/mp4" /> */}
                                    <video controls width="100%" height="250" ref={videoRef}>
                                        <source src={videoSrc} type="video/mp4" />
                                        <track
                                            label="English"
                                            kind="subtitles"
                                            srcLang="en"
                                            src={subtitleSrc}
                                            default
                                        />
                                        Sorry, your browser doesn't support embedded videos.
                                    </video>
                                </div>
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100">
                                    <form onSubmit={addCaptions} className='w-100 d-flex flex-column gap-4'>
                                        <div className='d-flex gap-2 justify-content-between'>
                                            <div className='input-group w-50'>
                                                <input type="text" className='form-control' ref={withMask('99:99:99')} value={startTime} onChange={handleStartTimeChange} placeholder='Enter Start Time' />
                                            </div>

                                            <div>to</div>
                                            <div className='input-group w-50'>
                                                <input type="text"  className='form-control ' value={endTime} ref={withMask('99:99:99')} onChange={handleEndTimeChange} placeholder='Enter End Time' />
                                            </div>
                                        </div>

                                        <div className="w-100">
                                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" placeholder='Enter Caption' value={captions} onChange={handleCaptionChange}></textarea>
                                        </div>

                                        <button type="submit" class="btn btn-outline-primary  w-100">Add Caption</button>
                                        <div>{error}</div>
                                    </form>

                                </div>
                            </div>

                            <div className='d-flex flex-column align-items-center bg-secondary-subtle mt-3 w-100'>
                                <div className='m-2 bg-light w-75 overflow-y-auto' style={{height: 225}}>
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
                                                        <td><button type="button" class="btn btn-outline-primary" onClick={()=>deleteCaption(key)}>Delete</button></td>
                                                    </tr>

                                                ))}
                                            </tbody>
                                            
                                        </table>
                                        
                                    </div>

                                </div>
                                <button type="button" class="btn btn-outline-primary m-2 w-50" onClick={showVideoWithCaptions} >View Video with Captions</button>
                            </div>
                        </div>
                }
            </div>
        </div>


    );
}


export default Page;