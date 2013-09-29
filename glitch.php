<?php
/**
 * Created by JetBrains PhpStorm.
 * User: wss-world
 * Date: 9/26/13
 * Time: 5:19 PM
 * To change this template use File | Settings | File Templates.
 */

require_once ('glitchPhoto.php');

header('Content-Type: application/json');
ini_set('gd.jpeg_ignore_warning', 1);

$id = $_POST['id'];
if($id) {
    $glitch = new glitchPhoto($id);

    if ($_POST['action'] == 'create') {
        $dataPhoto = json_decode($_POST['dataPhoto']);
        $dataPhotoGlitch = $glitch->createGlitchFriends($dataPhoto);

        $data = array(
            'dataPhotoGlitch' => $dataPhotoGlitch
        );

        echo json_encode($data);
    } elseif($_POST['action'] == 'update-glitch') {
        $index = $_POST['index'];

        $urlPhoto = $glitch->updateGlitchFriend($index);

        $data = array(
            'src' => $urlPhoto
        );

        echo json_encode($data);

    } elseif($_POST['action'] == 'post') {
        $upload_url = $_POST['upload_url'];
        $type = $_POST['name_img'];


        $resFileName = './/images//'.$id.'//mosaic-'.$type.'.jpg';

        if (file_exists($resFileName)) {
            unlink($resFileName);
        }

        $mosaic = imagecreatetruecolor(1026, 1026);


        $white = imagecolorallocate($mosaic, 0xFF, 0xFF, 0xFF);
        imagefill($mosaic, 1, 1, $white);

        $indexFileName = 0;
        $fileName = './/images//'.$id.'//'.$indexFileName.'-'.$type.'.jpg';
        for($i = 0; $i < 5; $i++) {
            for($j = 0; $j < 5; $j++) {
                $img = imagecreatefromjpeg($fileName);
                imagecopy($mosaic, $img, $j * 200 + (6 * $j + 1), $i * 200 + (6 * $i + 1), 0, 0, imagesx($img), imagesy($img));

                imagedestroy($img);

                $indexFileName++;
                $fileName = './/images//'.$id.'//'.$indexFileName.'-'.$type.'.jpg';
            }
        }

        imagejpeg($mosaic, './/images//'.$id.'//mosaic-'.$type.'.jpg', 75);


        $post_params['photo'] = '@.//images//'.$id.'//mosaic-'.$type.'.jpg';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $upload_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_params);
        $result = curl_exec($ch);
        curl_close($ch);

        $result = json_decode($result);

        $mess = array (server => $result->server, photo=> $result->photo, hash => $result->hash);

        echo json_encode($mess);
    } else {
        echo 'erorr2222';
    }
} else {
    echo 'error';
}