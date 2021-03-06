// base path
var basepath = "/images/background/";
// mảng lưu backgrou, type có 3 loại, loại 1 để full màn, loại 2 repeat lại, 3 là màu
const bgs = [
    { id: 0, path: "bg1.gif", name: "tree", type: 1 },
    { id: 1, path: "bg2.gif", name: "paper", type: 2 },
    { id: 2, path: "bg3.jpg", name: "wall-o", type: 2 },
    { id: 3, path: "bg4.jpg", name: "wall-w", type: 2 },
    { id: 4, path: "bg5.jpg", name: "covit", type: 2 },
    { id: 5, path: "bg6.png", name: "gift", type: 2 },
    { id: 6, path: "#0079bf", name: "blue", type: 3 },
];
// nếu lưu vào csdl thì viết trong các hàm này, lưu cái id để khi lấy ra thì lấy bgs[i]
function changeBackgroundType(bg) {
    if (bg.id === 0) {
        changeBackgroundType1(bg);
    } else if (bg.id > 0 && bg.id < 6) {
        changeBackgroundType2(bg);
    } else {
        changeBackgroundType3(bg);
    }
    var data = {
        id_background: bg.id
    }
    $.ajax({
        type: "POST",
        url: '/api/change_background',
        dataType: 'json',
        data: data
    })
}

// hàm phụ
function changeBackgroundType1(bg) {
    // chỉ dùng cho thằng bgs[0]
    document.body.style.background = `lightblue  url('${basepath}${bg.path}') no-repeat fixed center`;
}

function changeBackgroundType2(bg) {
    // chỉ dùng cho thằng bgs[1-5]
    document.body.style.background = `url('${basepath}${bg.path}') repeat`;
}

function changeBackgroundType3(bg) {
    // chỉ dùng cho thằng bgs[6]
    document.body.style.background = bg.path;
}

$.ajax({
        type: 'GET',
        url: '/api/id_background'
    })
    .then(data => {
        const bgs = [
            { id: 0, path: "bg1.gif", name: "tree", type: 1 },
            { id: 1, path: "bg2.gif", name: "paper", type: 2 },
            { id: 2, path: "bg3.jpg", name: "wall-o", type: 2 },
            { id: 3, path: "bg4.jpg", name: "wall-w", type: 2 },
            { id: 4, path: "bg5.jpg", name: "covit", type: 2 },
            { id: 5, path: "bg6.png", name: "gift", type: 2 },
            { id: 6, path: "#0079bf", name: "blue", type: 3 },
        ];
        var id_background = data['id_background']
        changeBackgroundType(bgs[id_background])
    })