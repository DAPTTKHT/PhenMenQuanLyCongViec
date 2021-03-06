function show_board_star(id, broadName) {
    var ul = document.getElementById('broad_star')
    var li = document.createElement('li')
    li.classList.add('select-menu')
    ul.append(li)

    var a = document.createElement('a')
    a.setAttribute('href', '/broad/' + id)
    li.append(a)
    var button = document.createElement('button')
    button.classList.add('btn')
    button.classList.add('btn-light')
    a.append(button)
    var img = document.createElement('img')
    img.setAttribute('width', '30')
    img.setAttribute('height', '30')
    img.setAttribute('src', "/images/work2.png")
    button.append(img)
    button.append(broadName)
}

function show_board_personal(id, broadName) {
    var ul = document.getElementById('broad_personal')
    var li = document.createElement('li')
    li.classList.add('select-menu')
    ul.append(li)

    var a = document.createElement('a')
    a.setAttribute('href', '/broad/' + id)
    li.append(a)
    var button = document.createElement('button')
    button.classList.add('btn')
    button.classList.add('btn-light')
    a.append(button)
    var img = document.createElement('img')
    img.setAttribute('width', '30')
    img.setAttribute('height', '30')
    img.setAttribute('src', "/images/work2.png")
    button.append(img)
    button.append(broadName)
}


$.ajax({
        type: 'GET',
        url: '/api/get_broad_star'
    })
    .then(data => {
        console.log('yeuuuuuuuu')
        console.log(data)
        data.forEach(element => {
            show_board_star(element['id'], element['broadName'])
        });
    })

$.ajax({
        type: 'GET',
        url: '/api/get_broad_personal'
    })
    .then(data => {
        console.log('yeuuuuuuuu')
        console.log(data)
        data.forEach(element => {
            show_board_personal(element['id'], element['broadName'])
        });
    })