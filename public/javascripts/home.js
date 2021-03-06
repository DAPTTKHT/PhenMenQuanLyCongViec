let broads = document.getElementById('broads');

// hien thi cac bang ra ma hinh
function showBroad(broadName, id) {
    let a = document.createElement('a')
    a.setAttribute("href", '/broad/' + id)

    let div = document.createElement('div')
    div.classList.add("card")

    let b = document.createElement('b')
    b.innerText = broadName

    a.append(div)
    div.append(b)
    broads.append(a)
}

// hien thi bang ra trang Home
$.ajax({
        url: '/api',
        type: 'get'
    })
    .then(data => {
        console.log(data)
        data.forEach(element => {
            showBroad(element['broadName'], element['id'])
        });
    })
    .catch(err => {
        console.log(err)
    })

// tao them bang
var button = document.getElementById('create_Broad')
var broad_name = document.getElementById('broadName')

button.addEventListener('click', () => {
    if (broad_name.value.trim() != "") {
        $.ajax({
                type: 'GET',
                url: '/get/email'
            })
            .then(data => {
                console.log(data)
                var email = data['email']
                var data = {
                        'email': email,
                        'broadName': broad_name.value,
                        'favourite': '0'
                    }
                    // dua du lieu de serve xu ly
                    // cap nhat co so du lieu
                $.ajax({
                    type: "POST",
                    url: "/broad/create_broad",
                    data: data,
                    dataType: "json",
                });

                $.ajax({
                        type: 'GET',
                        url: '/api/get_id_broad'
                    })
                    .then(id => {
                        showBroad(data['broadName'], id['id'])
                    })
                    // showBroad(broad_name.value, 1)

            })
            .catch(err => {
                console.log(err)
            })
    }
})

var show_star = document.getElementById('broad_star')


function show_boards_star(id, broadName) {
    let li = document.createElement('li')
    li.classList.add('select-menu')
    let a = document.createElement('a')
    a.setAttribute('href', '/broad/' + id)
    let button = document.createElement('button')

    button.classList.add('btn')
    button.classList.add('btn-light')
    let img = document.createElement('img')
    img.setAttribute('width', '30')
    img.setAttribute('height', '30')
    img.setAttribute('src', '/images/work2.png')
    button.append(img)
    button.append(broadName)

    show_star.append(li)
    li.append(a)
    a.append(button)

}

$.ajax({
        type: 'GET',
        url: '/api/get_broad_star'
    })
    .then(data => {
        console.log('data')
        console.log(data)
            // data.forEach(element => {
            //     show_boards_star(element['id'], element['broadName']);
            // });
        for (var count = 0; count < data.length; count++) {
            show_boards_star(data[count]['id'], data[count]['broadName']);
            if (count == 4) break
        }
        let li = document.createElement('li')
        li.classList.add('select-menu')
        let button = document.createElement('button')
        button.classList.add('btn')
        button.setAttribute('data-toggle', 'modal')
        button.setAttribute('data-target', '#createBroad')
        button.innerText = 'Create a board'
        let i = document.createElement('i')
        i.classList.add('fas')
        i.classList.add('fa-plus')
        show_star.append(li)
        li.append(button)
        button.append(i)
    })
    .catch(err => {
        console.log(err)
    })