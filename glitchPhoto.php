<?php
/**
 * Created by JetBrains PhpStorm.
 * User: wss-world
 * Date: 9/26/13
 * Time: 5:22 PM
 * To change this template use File | Settings | File Templates.
 */

class glitchPhoto {
    var $id;
    var $nameDir;


    function __construct($id) {
        $this->id = $id;
        $this->nameDir = './/images//'.$id;

        if (!file_exists($this->nameDir)) {
            mkdir($this->nameDir);
        }

    }

    function updateGlitchFriend($index) {
        $file_name = $this->nameDir.'//'.$index.'-normal.jpg';
        $fh = fopen($file_name, 'r');
        $photoBin = fread($fh, filesize($file_name));
        fclose($fh);

        $photoBinGlitch = $this->createGlitchPhoto($photoBin, true);

        $fh_g = fopen($this->nameDir.'//'.$index.'-glitch.jpg', 'w+');
        fwrite($fh_g, $photoBinGlitch);
        fclose($fh_g);

        /*Реализация склеивания картинок    */

        return 'http://'.$_SERVER['HTTP_HOST'].'/images/'.$this->id.'/'.$index.'-glitch.jpg';
    }

    function createGlitchFriends($dataPhoto) {

        $dataPhotoGlitch = array();

        foreach($dataPhoto as $index => $urlPhoto) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $urlPhoto);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);

            $photoBin = curl_exec($ch);
            curl_close($ch);

            $fh = fopen($this->nameDir.'//'.$index.'-normal.jpg', 'w+');
            fwrite($fh, $photoBin);
            fclose($fh);

            $photoBinGlitch = $this->createGlitchPhoto($photoBin);
            /*Реализация склеивания картинок    */

            $fh = fopen($this->nameDir.'//'.$index.'-glitch.jpg', 'w+');
            fwrite($fh, $photoBinGlitch);
            fclose($fh);
            array_push($dataPhotoGlitch, 'http://'.$_SERVER['HTTP_HOST'].'/images/'.$this->id.'/'.$index.'-glitch.jpg');

        }

        return $dataPhotoGlitch;
    }

    function createGlitchPhoto($photo, $update = false) {
        $maxIterations = 64;
        $headerSize = 417;

        if($update) {
            $glitchiness = rand(7, 150)/100;
            $seed = rand(3, 24);
        } else {
            $glitchiness = 0.15;
            $seed = 24;
        }


        $length = strlen($photo) - $headerSize - 2;
        $amount = (int)($glitchiness * $maxIterations);
        $random = $seed;

        for ($i = 0; $i < $amount; $i++ ) {
            $random = ($random * 16807) % 2147483647;
            $position = $headerSize + (int)($length * $random * 4.656612875245797e-10);

            $photo[$position] = pack("C", 00);
        }

        return $photo;
    }
}