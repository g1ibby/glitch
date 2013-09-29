var result_count = 0;
var result = [];



while (result_count < 25) {
    var a = API.friends.get({
            "user_id": 99032559,
            "order": "random",
            "count": 1,
            "fields": "photo_200",
            "name_case": "nom"}
    );

    if(a.items[0].photo_200) {
        var r_i = 0;
        var flg = true;
        while (r_i < result_count) {
            if (result[r_i].id == a.items[0].id) {
                flg = false;
                break;
            }
            r_i = r_i + 1;
        }
        if (flg) {
            result.push(a.items[0]);
            result_count = result_count + 1;
        }

    }

}

return result;


var a = API.friends.get({"user_id": 99032559, "order": "random",
    "count": 1,
    "fields": "photo_200",
    "name_case": "nom"});
return {"a": a};

var result_count = 0;
var b = 25;
var result;
while (result_count < b) {
    var a = API.friends.get({
        "user_id": 99032559,
        "order": "random",
        "count": 1,
        "fields": "photo_200",
        "name_case": "nom"});
    result[result_count] = "hi";
    result_count = result_count+1;
};
return result_count;










$.each(res, function(i, value) {
    console.log('text each vk   ');
    console.log(value);
    if (value.photo_200) {
        var element = {
            id: value.uid,
            photo: value.photo_200,
            photoGlitch: null,
            firstName: value.first_name,
            lastName: value.last_name
        };
        friends.listFriends.push(element);
    } else {
        getFriendOneVk(id, getFriendOneVkCallback);

        function getFriendOneVkCallback(err, res) {
            console.log('get friend one vk    '.res);
            if (err) {
                getFriendOneVk(id, getFriendOneVkCallback);
            } else {
                var element = {
                    id: res.uid,
                    photo: res.photo_200,
                    photoGlitch: null,
                    firstName: res.first_name,
                    lastName: res.last_name
                };
                friends.listFriends.push(element);
            }
        }

    }
});



var limit = 25;
var result = [];
var friends = API.friends.get({user_id: 99032559, fields: "photo_50,photo_200", order: "random"}).items;
var i = 0;
while (result.length < limit && i < friends.length) {
    if (friends[i].photo_50 != "http://vk.com/images/camera_c.gif" && friends[i].photo_50 != "http://vk.com/images/deactivated_c.gif") {
        result = result + [friends[i]];
    }
    i = i + 1;
}
return result;