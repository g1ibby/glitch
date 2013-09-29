/**
 * Created with JetBrains PhpStorm.
 * User: wss-world
 * Date: 9/22/13
 * Time: 8:20 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {

    VK.init({
        apiId: 3892051
    });

    $('.glitch-button').on('click', function() {
        VK.Auth.login(authCheck, 4);

    });

    $('.one-glitch').on('mouseover', function() {
        $(this).find('.photo-glitch').hide();
        $(this).find('.photo').show();
        $(this).find('.update-glitch').show();
    });

    $('.one-glitch').on('mouseout', function() {
        $(this).find('.photo').hide();
        $(this).find('.photo-glitch').show();
        $(this).find('.update-glitch').hide();
    });

    $('.wall-post').on('click', function(e) {
        e.preventDefault();


        var wallPost = $(this);
        wallPost.hide();
        $('.wall-post-load').removeClass('hide').show();

        console.log('start post');
        postWall(function(err, res) {
            if(res) {
                console.log('wall.post: ');
                console.log(res);
                $('.wall-post-load').hide();
                wallPost.show();
            } else {
                $('.wall-post-load').hide();
                wallPost.show();
                console.log('wall post cancle');
            }
        })


    });

    function postWall(callback) {
        saveWallPhoto('glitch', function(err, resGlitch) {

            console.log('resGlitch: ');
            console.log(resGlitch);

            saveWallPhoto('normal', function(err, resNormal) {


                console.log('resNormal: ');
                console.log(resNormal);

                VK.Api.call('wall.post', { // постим на стену
                    attachments : resNormal.response[0].id + ',' + resGlitch.response[0].id + ',http://glitch.pusku.com',
                    message : 'Создай Глитч-арт мозаику из фотографий своих друзей! #glitch'
                }, function(result) {

                    if (result.response) {
                        callback(null, result.response);
                    } else {
                        callback(true, null);
                    }

                });
            })
        })
    }



    function saveWallPhoto(type, callback) {

        VK.Api.call('photos.getWallUploadServer', {}, function(res) {


            var uploadUrl = res.response.upload_url;
            $.post(
                'glitch.php',
                {
                    action: 'post',
                    id: VK.Auth.getSession().mid,
                    upload_url: uploadUrl,
                    name_img: type
                },
                function (json) {


                    console.log('json: ');
                    console.log(json);


                    VK.Api.call('photos.saveWallPhoto', {"user_id": VK.Auth.getSession().mid, server: json.server, photo:json.photo, hash: json.hash}, function(res) {

                        callback(null, res);
                    });
                },
                'json'
            );
        });
    }


    $('.update-table').on('click', function(e) {
        e.preventDefault();

        $('.wall-post').show();
        $('.wall-post-load').hide();
        $('.content').hide();
        $('.preloaders-img').show();

        var id = VK.Auth.getSession().mid;

        initializing(id);
    });

    $('.update-glitch').on('click', function() {
        var oneGlitch = $(this).parent('.one-glitch');
        var index = oneGlitch.data('index');

        var id = VK.Auth.getSession().mid;

        $.ajax({
            url: 'glitch.php',
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'update-glitch',
                id: id,
                power: 5,
                index: index
            },
            success: function(data, code) {

                oneGlitch.find('.photo-glitch').attr('src', data.src + '?v='+(new Date()).getTime());

                var photo = oneGlitch.find('.photo');
                var photoGlitch = oneGlitch.find('.photo-glitch');
                photo.hide();
                photoGlitch.show();
            }
        });
    });

    function initializing(id) {
        $('.glitch-button').hide();
        $('.preloaders-img').show();
        friends.loadFriends(id, function(err, res) {
            console.log('Friends download!!!')
            if(res) {
                friends.createGlitch(id, 25, function(err, res) {
                    if(res) {
                        updateTableGlitch();
                        $('.preloaders-img').hide();
                        $('.content').show();
                    } else {
                        $('.preloaders-img').hide();
                        $('.glitch-button').show();
                    }
                });
            } else {
                $('.preloaders-img').hide();
                $('.glitch-button').show();
            }
        });
    }

    function updateTableGlitch() {
        var tableGlitch = $('.content-glitch .one-glitch');
        tableGlitch.each(function(index) {

            $(this).find('.update-glitch').hide();


            var urlFriends = 'http://vk.com/id'+friends.getFriend(index).id;
            $(this).find('a').attr('href', urlFriends);

            var src = friends.getFriend(index).photo;
            var fullName = friends.getFriend(index).firstName + ' ' + friends.getFriend(index).lastName;
            $(this).find('.photo').attr('src', src).attr('title', fullName);
            $(this).find('.photo').hide();

            src = friends.getFriend(index).photoGlitch + '?v='+(new Date()).getTime();
            $(this).find('.photo-glitch').attr('src', src);

            $(this).data('index', index);
        })
    }



    var friends = {
        listFriends: [],
        num: 25,
        loadFriends: function(id, callback) {
            getFriendsVk(id, this.num, function(err, res) {
                if(err) {
                    callback(err, null);
                    return;
                }


                friends.listFriends = [];
                var i = 0;
                while(friends.listFriends.length < friends.num && i < friends.num * 2) {


                    if('photo_200' in res[i]) {
                        var element = {
                            id: res[i].id,
                            photo: res[i].photo_200,
                            photoGlitch: null,
                            firstName: res[i].first_name,
                            lastName: res[i].last_name
                        };
                        friends.listFriends.push(element);
                    }
                    i++;
                }

                console.log('listFriends: ');
                console.log(friends.listFriends);

                callback(null, true);

            });
        },
        createGlitch: function(id, power, callback) {
            var dataPhoto = [];
            for (var i = 0; i < this.listFriends.length; i++) {
                dataPhoto.push(this.listFriends[i].photo);
            }

            getGlitchPhoto(id, power, dataPhoto, function(err, dataPhotoGlitch) {
                if(err) {
                    callback(err, null);
                    return;
                }

                console.log('data server my: ');
                console.log(dataPhotoGlitch);

                for (var i = 0; i < dataPhotoGlitch.length; i++) {
                    friends.listFriends[i].photoGlitch = dataPhotoGlitch[i];
                }

                callback(null, true);
            });
        },
        getFriend: function(index) {
            if(index <= this.num && index >= 0) {
                return this.listFriends[index];
            } else {
                return -1;
            }
        }
    };

    function authCheck(response) {
        if (response.session) {
            initializing(response.session.mid);
        } else {
            console.log('error login site');
        }
    }

    function getFriendsVk(id, num, callback) {
        if (!id) {
            callback({
                code: 101,
                message: 'ID is not valid'}, null);

            return;
        }
        if (num <= 0) {
            callback({
                code: 103,
                message: 'null friends'}, null);

            return;
        }

        var code = 'var limit = ' + num * 2 + ';' +
            'var result = [];' +
            'var friends = API.friends.get({user_id: ' + id + ', fields: "photo_50,photo_200", order: "random"}).items;' +
            'var i = 0;' +
            'while (result.length < limit && i < friends.length) {' +
            'if (friends[i].photo_50 != "http://vk.com/images/camera_c.gif" && friends[i].photo_50 != "http://vk.com/images/deactivated_c.gif") {' +
            'result = result + [friends[i]];' +
            '}' +
            'i = i + 1;' +
            '}' +
            'return result;';




        VK.Api.call('execute', {
            code: code,
            v: '5.0'
        }, function(result) {
            console.log('response vk server');
            console.log(result);
            if(result.response) {
                callback(null, result.response);
            } else {
                callback({
                    code: 102,
                    message: 'error in vkontakte'}, null);

                return;
            }
        });
    }

    function getGlitchPhoto(id, power, dataPhoto, callback) {
        if (!id) {
            callback({
                code: 101,
                message: 'ID is not valid'}, null);

            return;
        }
        if (power <= 0) {
            callback({
                code: 104,
                message: 'null power'}, null);

            return;
        }

        console.log('готов отправить данные на свой сервер');

        $.ajax({
            url: 'glitch.php',
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'create',
                id: id,
                power: power,
                dataPhoto: JSON.stringify(dataPhoto)
            },
            success: function(data, code) {
                console.log('server response');
                console.log(data);
                callback(null, data.dataPhotoGlitch);
            }
        });
    }
});