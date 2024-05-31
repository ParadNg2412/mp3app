'use client'
import React, {useState, useRef, useEffect} from "react";
import { FaPlay, FaPause, FaForward, FaBackward} from "react-icons/fa";

interface Song {
    id: number;
    title: String;
    artist: String;
    src: string;
}

interface PlayerProps {
    Songs: Song[];
}

const Player: React.FC<PlayerProps> = ({ Songs }) => {
    const [currentSongIndex, setCurrentSOngIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if(audioRef.current){
            audioRef.current.src = Songs[currentSongIndex]?.src || '';
            if(isPlaying){
                audioRef.current.play();
            }
        }
    }, [currentSongIndex, Songs, isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if(audio){
            const setAudioData = () => {
                setDuration(audio.duration);
            };
            const setAudioTime = () => {
                setCurrentTime(audio.currentTime);
            };
            audio.addEventListener('loadeddata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);
            return () => {
                audio.removeEventListener('loadeddata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
            };
        }
    }, [isPlaying])

    //Chạy & dừng
    function playPause() {
        if(isPlaying){
            audioRef.current?.pause();
        }
        else{
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    }

    //Đổi sang bài tiếp theo
    function playNext() {
        setCurrentSOngIndex((prevIndex) => (prevIndex + 1) % Songs.length);
        setIsPlaying(true);
    }

    //Đổi sang bài trước
    function playPrevious() {
        setCurrentSOngIndex((prevIndex) => prevIndex === 0 ? Songs.length - 1 : prevIndex - 1);
        setIsPlaying(true);
    }


    function seek (event: React.ChangeEvent<HTMLInputElement>) {
        if(audioRef.current){
            audioRef.current.currentTime = Number(event.target.value);
            setCurrentTime(audioRef.current.currentTime);
        }
    }

    function formatTime(time: number){
        const minutes = Math.floor(time/60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    return (
        <div className="player py-4">
            <h2 className="font-bold">{Songs[currentSongIndex].title}</h2>
            <h3>{Songs[currentSongIndex].artist}</h3>
            <audio ref={audioRef}
                    src={Songs[currentSongIndex].src}
                    onEnded={()=>playNext()}/>
            <div className="process-bar flex item-center gap-2">
                <span>{formatTime(currentTime)}</span>
                    <input type="range" value={currentTime} max={duration} onChange={seek}/>
                <span>{formatTime(duration)}</span>
            </div>
            
            <div className="controls flex item-center gap-4 px-5">
                <button className="px-2" onClick={() => playPrevious()}><FaBackward size={24}/></button>
                <button className="px-2" onKeyDown={(e) => e.key === 'space'} onClick={() => playPause()}>{isPlaying ? <FaPause size={24}/> : <FaPlay size={24}/>}</button>
                <button className="px-2" onClick={() => playNext()}><FaForward size={24}/></button>
            </div>
        </div>
    );
};

export default Player;