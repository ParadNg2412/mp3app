'use client'
import { use, useRef, useState } from "react";
import Player from "@/components/Player";
import SongManager from "./SongManager";


type Props = {}

export default function MusicApp({}: Props) {
    const [songs, setSongs] = useState([
        {id: 1, title: 'Bittersweet', artist: 'Shuichiro Naito, Asuka Kawazu, Aoki Ryo, Takaya Yamaguchi', src: './songs/bittersweet.mp3', isFavorite: false},
        {id: 2, title: 'To you, who have lived until today', artist: 'Skypeace', src: './songs/To You, Who Have Lived Until Today.mp3', isFavorite: true},
        {id: 3, title: 'MUGEN', artist: 'MY FIRST STORY & HYDE', src: './songs/MUGEN.mp3', isFavorite: true},
        {id: 4, title: 'The Weekend Whip (The LEGO Ninjago movie)', artist: 'The Fold', src: './songs/The Weekend Whip (The LEGO Ninjago movie).mp3', isFavorite: false},
    ]);

    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggleFavorite = (id: number) => {
      setSongs(songs.map(song => song.id === id ? { ...song, isFavorite: !song.isFavorite} : song))
  }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">My Music App</h1>
        <Player Songs={songs} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioRef={audioRef}/>
        <SongManager songs={songs} setSongs={setSongs} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioRef={audioRef} toggleFavorite={toggleFavorite}/>
      </div>
    );
}

