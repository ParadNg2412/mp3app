'use client'
import React, {useState, useRef, useEffect} from "react";
import { FaPlay, FaPause, FaForward, FaBackward, FaRedo} from "react-icons/fa";

interface Song {
    id: number;
    title: string;
    artist: string;
    src: string;
    isFavorite: boolean;
}

interface PlayerProps {
    Songs: Song[];
    currentSongIndex: number;
    setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    audioRef: React.RefObject<HTMLAudioElement>;
}

const Player: React.FC<PlayerProps> = ({ Songs, currentSongIndex, setCurrentSongIndex, isPlaying, setIsPlaying, audioRef, }) => {
    // const [isPlaying, setIsPlaying] = useState(false);
    // const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loopMode, setLoopMode] = useState<0 | 1 | 2>(0); //0: Ko lặp, 1: Lặp tất cả, 2: Lặp vô hạn 1 bài

    useEffect(() => {
        if(audioRef.current){
            audioRef.current.src = Songs[currentSongIndex]?.src || '';
            audioRef.current.onloadeddata = () => {
                setDuration(audioRef.current!.duration);
            };
            if(isPlaying){
                audioRef.current!.play();
            }
            
        }
    }, [currentSongIndex, Songs]);

    useEffect(() => {
        if(audioRef.current){
            if(isPlaying){
                audioRef.current.play();
            }
            else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if(audioRef.current){
            const timeUpdate = () => {
                setCurrentTime(audioRef.current!.currentTime);
            };
            const songEnd = () => {
                if(loopMode === 2){
                    audioRef.current!.currentTime = 0;
                    audioRef.current!.play();
                    
                }
                else{
                    if(loopMode === 1){
                        setCurrentSongIndex(prev => prev === Songs.length - 1 ? 0 : prev + 1);
                    }
                    else{
                        setIsPlaying(false);
                    }
                }              
            }
            audioRef.current.addEventListener('timeupdate', timeUpdate);
            audioRef.current.addEventListener('ended', songEnd);
            return () => {
                audioRef.current?.removeEventListener('timeupdate', timeUpdate);
                audioRef.current?.removeEventListener('ended', songEnd);
            }
        }      
    }, [currentSongIndex, loopMode, Songs.length, setCurrentSongIndex, setIsPlaying,]);

    //Chạy & dừng
    function playPause() {       
        setIsPlaying(!isPlaying);   
    }

    //Đổi sang bài tiếp theo
    function playNext() {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % Songs.length);
        setIsPlaying(true);
    }

    //Đổi sang bài trước
    function playPrevious() {
        setCurrentSongIndex((prevIndex) => prevIndex === 0 ? Songs.length - 1 : prevIndex - 1);
        setIsPlaying(true);
    }

    //vòng lặp
    function loopSong(){
        setLoopMode((prevLoop) => {
            if(prevLoop === 0){
                return 2;
            }
            if(prevLoop === 2){
                return 1;
            }
            return 0;
        });
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
            <h2 className="font-bold">{Songs[currentSongIndex]?.title}</h2>
            <h3>{Songs[currentSongIndex]?.artist}</h3>
            <audio ref={audioRef}
                    src={Songs[currentSongIndex].src}
                    onEnded={()=>playNext()}/>
            <div className="process-bar flex item-center gap-2">
                <span>{formatTime(currentTime)}</span>
                    <input type="range" value={currentTime} max={duration} onChange={seek} className="flex-grow"/>
                <span>{formatTime(duration)}</span>
            </div>
            
            <div className="controls flex item-center gap-4 px-5">
                <button className="px-2" onClick={() => playPrevious()}><FaBackward size={24}/></button>
                <button className="px-2" onKeyDown={(e) => e.key === 'space'} onClick={() => playPause()}>{isPlaying ? <FaPause size={24}/> : <FaPlay size={24}/>}</button>
                <button className="px-2" onClick={() => playNext()}><FaForward size={24}/></button>
                <button className="px-2" onClick={() => loopSong()}>
                    {loopMode === 0 &&  <FaRedo size={24}/>}
                    {loopMode === 1 &&  <FaRedo size={24} color="blue"/>}
                    {loopMode === 2 &&  <FaRedo size={24} color="red"/>}
                </button>
            </div>
        </div>
    );
};

export default Player;