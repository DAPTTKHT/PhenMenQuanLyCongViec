// Xử lý hàm search
// Khi người dùng nhập key vào, nó sẽ lấy dữ liệu từ db đổ vào , cái này chỉ search broad thôi.
$(document).ready(function() {
    $("input.form-control.form-control-sm.ml-3.w-75.dropdown-toggle").keydown(function() {

        $('#resultSearch').empty(); //Hàm xóa hết các li bên trong
        // Hàm append này chỉ cần thay nd CNWeb với link thẻ a, link img
        var search = document.getElementById('search_board_1')
        var data = {
            broadName: search.value
        }
        $.ajax({
                type: 'POST',
                url: '/api/get_post_board',
                data: data,
                dataType: 'json'
            })
            .then(data => {
                data.forEach(element => {
                    var li = document.createElement('li')
                    $('#resultSearch').append(li)
                    li.classList.add('dropdown-item')
                    var a = document.createElement('a')
                    li.append(a)
                    a.setAttribute('href', '/broad/' + element['id'])
                    var span = document.createElement('span')
                    a.append(span)
                    var img = document.createElement('img')
                    span.append(img)
                    img.setAttribute('width', '40')
                    img.setAttribute('height', '40')
                    img.setAttribute('src', '/images/work2.png')
                    span.append(element['broadName'])
                });
            })


    });
});