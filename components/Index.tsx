'use client'
import { use, useState } from "react";
import Player from "@/components/Player";
import SongManager from "./SongManager";


type Props = {}

export default function MusicApp({}: Props) {
    const [songs, setSongs] = useState([
        {id: 1, title: 'Bittersweet', artist: 'Shuichiro Naito, Asuka Kawazu, Aoki Ryo, Takaya Yamaguchi', src: './songs/bittersweet.mp3'},
        {id: 2, title: 'To you, who have lived until today', artist: 'Skypeace', src: './songs/To You, Who Have Lived Until Today.mp3'}
    ]);

    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">My Music App</h1>
        <Player Songs={songs} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex}/>
        <SongManager songs={songs} setSongs={setSongs} setCurrentSongIndex={setCurrentSongIndex}/>
      </div>
    );
}

