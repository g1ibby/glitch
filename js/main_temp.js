/**
 * Created with JetBrains PhpStorm.
 * User: wss-world
 * Date: 9/22/13
 * Time: 3:07 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function(){
    VK.init({
        apiId: 3892051
    });

    function authInfo(response) {
        if (response.session) {
            alert('user: '+response.session.mid);
            var mid = response.session.mid;
            VK.Api.call('friends.get', {user_id: mid, order: 'random', count: 25, fields: 'nickname,photo_100'}, function(r) {
                if(r.response) {
                    $.each(r.response, function(i, val){
                        console.log(i+': '+val.photo_100);

                    });

                    $.ajax({
                        url: 'test.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            uid: mid,
                            photo: r.response
                        },
                        success: function(data, code) {
                            console.log(data);

                        }
                    });
                }
            });
        } else {
            alert('not auth');
        }
    }

    $('.login_button').on('click', function() {
        VK.Auth.login(authInfo);

    });
});