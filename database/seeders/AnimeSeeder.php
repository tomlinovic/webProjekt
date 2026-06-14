<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnimeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('anime')->insertOrIgnore([
            ['id' => 1, 'title' => 'Naruto', 'episodes' => 220, 'average_score' => 80, 'description' => 'Naruto Uzumaki, a hyperactive and knuckle-headed ninja, lives in Konohagakure, the Hidden Leaf village.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20-dE6UHbFFg1A5.jpg', 'status' => 'finished'],
            ['id' => 2, 'title' => 'The Seven Deadly Sins', 'episodes' => 24, 'average_score' => 73, 'description' => 'When they were accused of trying to overthrow the monarchy, the feared warriors the Seven Deadly Sins were sent into exile.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20789-Ma5ouSYPkru9.jpg', 'status' => 'finished'],
            ['id' => 3, 'title' => 'Black Clover', 'episodes' => 170, 'average_score' => 79, 'description' => 'In a world where magic is everything, Asta and Yuno are both found abandoned at a church on the same day.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx97940-fyh8o7gNbha0.png', 'status' => 'finished'],
            ['id' => 4, 'title' => 'Bleach', 'episodes' => 366, 'average_score' => 79, 'description' => 'Ichigo Kurosaki is a rather normal high school student apart from the fact he has the ability to see ghosts.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx269-d2GmRkJbMopq.png', 'status' => 'finished'],
            ['id' => 5, 'title' => 'Record of Ragnarok', 'episodes' => 12, 'average_score' => 67, 'description' => '7 million years of human civilization is coming to an end...', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx127399-AAH1pevCZLrB.jpg', 'status' => 'finished'],
            ['id' => 6, 'title' => 'BLUE LOCK', 'episodes' => 24, 'average_score' => 80, 'description' => 'Japan\'s desire for World Cup glory leads the Japanese Football Association to launch a new rigorous training program.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx137822-U8naszP96vzC.png', 'status' => 'finished'],
            ['id' => 7, 'title' => 'Fairy Tail', 'episodes' => 175, 'average_score' => 72, 'description' => 'Across the Fiore kingdom, wizards join guilds and make their pay by filling magical needs.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b6702-KI4qgSMyI8Pm.png', 'status' => 'finished'],
            ['id' => 8, 'title' => 'Death Note', 'episodes' => 37, 'average_score' => 84, 'description' => 'Light Yagami is a genius high school student who is about to learn about life through a book of death.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1535-kUgkcrfOrkUM.jpg', 'status' => 'finished'],
            ['id' => 9, 'title' => 'Attack on Titan', 'episodes' => 25, 'average_score' => 85, 'description' => 'Several hundred years ago, humans were nearly exterminated by titans.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-buvcRTBx4NSm.jpg', 'status' => 'finished'],
            ['id' => 10, 'title' => 'Hunter x Hunter', 'episodes' => 62, 'average_score' => 83, 'description' => 'A Hunter is one who travels the world doing all sorts of dangerous tasks.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx136-gj0bbCpDNrKG.jpg', 'status' => 'finished'],
            ['id' => 11, 'title' => 'Demon Slayer: Kimetsu no Yaiba', 'episodes' => 26, 'average_score' => 83, 'description' => 'It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101922-WBsBl0ClmgYL.jpg', 'status' => 'finished'],
            ['id' => 12, 'title' => 'JUJUTSU KAISEN', 'episodes' => 24, 'average_score' => 84, 'description' => 'A boy fights for the right death. Hardship, regret, shame: the negative feelings that humans feel become Curses.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-LHBAeoZDIsnF.jpg', 'status' => 'finished'],
            ['id' => 13, 'title' => 'My Hero Academia', 'episodes' => 13, 'average_score' => 77, 'description' => 'What would the world be like if 80 percent of the population manifested extraordinary superpowers called Quirks at age four?', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21459-nYh85uj2Fuwr.jpg', 'status' => 'finished'],
            ['id' => 14, 'title' => 'One-Punch Man', 'episodes' => 12, 'average_score' => 83, 'description' => 'Saitama has a rather peculiar hobby, being a superhero, but despite his heroic deeds, a shadow looms over his life.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21087-B5DHjqZ3kW4b.jpg', 'status' => 'finished'],
            ['id' => 15, 'title' => 'Tokyo Ghoul', 'episodes' => 12, 'average_score' => 76, 'description' => 'The suspense horror/dark fantasy story is set in Tokyo, which is haunted by mysterious ghouls who are devouring humans.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b20605-k665mVkSug8D.jpg', 'status' => 'finished'],
            ['id' => 16, 'title' => 'ONE PIECE', 'episodes' => 0, 'average_score' => 87, 'description' => 'Gold Roger was known as the Pirate King, the strongest and most infamous being to have sailed the Grand Line.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21-ELSYx3yMPkru9.jpg', 'status' => 'releasing'],
            ['id' => 17, 'title' => 'Attack on Titan Season 2', 'episodes' => 12, 'average_score' => 85, 'description' => 'Eren Jaeger swore to wipe out every last Titan, but in a battle for his life he wound up becoming the thing he hates most.', 'cover_image' => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20958-HuFJyr54Mmir.jpg', 'status' => 'finished'],
        ]);
    }
}
