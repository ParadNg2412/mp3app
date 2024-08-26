import React, { useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

interface Song {
    id: number;
    title: string;
    artist: string;
    src: string;
}

interface SongManagerProps {
    songs: Song[];
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
    currentSongIndex: number;
    setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    audioRef: React.RefObject<HTMLAudioElement>;
}

const SongManager: React.FC<SongManagerProps> = ({songs, setSongs, currentSongIndex, setCurrentSongIndex, isPlaying, setIsPlaying, audioRef,}) => {
    const [newSong, setNewSong] = useState<{id?: string, title: string; artist: string; file: File | null}>({title: '', artist: '', file: null});

    const input = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSong({...newSong, [name]: value});
    };

    const file = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setNewSong({...newSong, file: e.target.files[0]});
        }
    };

    function addSong(){
        if(newSong.title && newSong.artist && newSong.file){
            const songId = songs.length + 1;
            const songSrc = URL.createObjectURL(newSong.file);
            setSongs([...songs, {id: songId, title: newSong.title, artist: newSong.artist, src: songSrc}]);
            setNewSong({title: '', artist: '', file: null});
            
        }
    }

    function deleteSong(id: number){
        setSongs(songs.filter(song => song.id !== id));
    }

    function editSong(id: number){
        const songToEdit = songs.find(song => song.id === id);
        if(songToEdit){
            setNewSong({title: songToEdit.title, artist: songToEdit.artist, file: null});
            setSongs(songs.filter(song => song.id !== id));
        }
    }

    function playSong (index: number){
        if(audioRef.current){
            if(index === currentSongIndex){
                audioRef.current.currentTime = 0;
                audioRef.current.play()
                setIsPlaying(true);
            }
            else{
                setCurrentSongIndex(index);
                setIsPlaying(true);
            }
        }
    }

    return (
        <div className="song-manager pt-2">
            <h2 className="pt-2">Song Manager</h2>
            <div className="song-form">
                <input className="border p-2" type="text" name="title" value={newSong.title} onChange={input} placeholder="Song Title"/>
                <input className="border p-2" type="text" name="artist" value={newSong.artist} onChange={input} placeholder="Artist"/>
                <input className="border p-2" type="file" name="file" accept="audio/mp3" onChange={file} />
                <button onClick={() => addSong()} className="bg-blue-500 text-white p-2">Add</button>
            </div>
            <ul className="song-list mt-4">
                {songs.map((song, index) => (
                    <li key={song.id} className="flex justify-between items-center p-2S border-b">
                        <div className="flex items-center">
                            <button onKeyDown={(e) => e.key === 'space'} onClick={() => playSong(index)} className="mr-2">{isPlaying && index === songs.findIndex(s => s.src === audioRef.current?.src) ? (<FaPause size={15}/>) : (<FaPlay size={15}/>)}</button>
                            <span className="cursor-pointer pl-3">
                                <h2 className="font-bold">{song.title}</h2>
                                <a>{song.artist}</a>
                            </span>
                            <div className="pl-96">
                                {/* <button onClick={() => editSong(song.id)} className="bg-yellow-500 text-white p-1 mr-2">Edit</button> */}
                                <button onClick={() => deleteSong(song.id)} className="bg-red-500 text-white p-1 mr-2"><FaTrashCan size={15}/></button>
                            </div>
                        </div>
                                                
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SongManager;