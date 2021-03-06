function checklist() {
  $(document).ready(function () {
    // get box count
    var count = 0;
    var checked = 0;

    function countBoxes() {
      count = $("input[type='checkbox']").length;
      console.log("count : " + count);
    }

    countBoxes();
    $(":checkbox").click(() => {
      countBoxes();
    });
    // count checks

    function countChecked() {
      checked = $("input:checked").length;
      console.log("checked : " + checked);
      if (count !== 0) {
        var percentage = parseInt((checked / count) * 100, 10);
        $(".progressbar-bar").progressbar({
          value: percentage,
        });
        $(".progressbar-label").text(percentage + "%");
      }
    }

    countChecked();
    $(":checkbox").click(() => {
      countChecked();
    });
  });
}

function sortTable() {
  $(function () {
    $('ul[id^="sort"]')
      .sortable({
        connectWith: ".sortable",
      })
      .disableSelection();
  });
}

function dateTime() {
  // due time
  $(function () {
    $("#startDate").datetimepicker({
      timepicker: true,
      datepicker: true,
      format: "Y-m-d H:i", // formatDate
      hours12: false,
      step: 1,
      onShow: function () {
        this.setOptions({
          maxDate: $("#endDate").val() ? $("#endDate").val() : false,
        });
      },
    });
    $("#endDate").datetimepicker({
      timepicker: true,
      datepicker: true,
      format: "Y-m-d H:i",
      hours12: false,
      step: 1,
      onShow: function () {
        this.setOptions({
          minDate: $("#startDate").val() ? $("#startDate").val() : false,
        });
      },
    });
  });
}
// format date theo định dạng
function formatMinDate(date) {
  const d = date;
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  const hour = new Intl.DateTimeFormat("en", { hour: "numeric" }).format(d);
  const minute = new Intl.DateTimeFormat("en", { minute: "2-digit" }).format(d);
  return `${da}/${mo}`;
}

function formatDate(date) {
  const d = date;
  var space = "  ";
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  const hour = new Intl.DateTimeFormat("en", { hour: "numeric" }).format(d);
  const minute = new Intl.DateTimeFormat("en", { minute: "2-digit" }).format(d);
  return `${da}/${mo}/${ye}${space}${hour}:${minute}`;
}
let root = document.getElementById("root");

class todoList {
  constructor(place, title = "List", id) {
    this.place = place;
    this.state = {
      text: title,
    };
    this.cardArray = [];
    this.id = id;
    this.render();
  }

  addToDo(id_, description) {
    let text = this.input.value;
    this.cardArray.push(new Card(text, this.div, this, id_, description));
  }

  createToDoListElement() {
    //Create elements
    this.h2 = document.createElement("h2");
    // this.h2.innerText = this.state.text;
    this.divAdd = document.createElement("div");
    this.divAdd.className = "row";
    this.input = document.createElement("input");
    this.input.classList.add("comment");
    this.input.className = "comment col-sm-8";
    this.button = document.createElement("button");
    this.button.innerText = "Add";
    this.button.classList.add("btn-save");
    this.button.className = "btn-save col-sm-3";
    this.divAdd.append(this.input, this.button);
    this.button.id = "to-do-list-button";
    // ul bao card
    this.div = document.createElement("ul");
    this.div.classList.add("sortable");
    this.div.classList.add("ui-sortable");
    this.div.id = "sort";
    // bao ngoài cùng
    this.todoListElement = document.createElement("div");
    this.todoListElement.classList.add("todoList");
    this.todoListElement.setAttribute("id", this.id);
    //

    //Add Event listener
    this.button.addEventListener("click", () => {
      if (this.input.value != "") {
        //  this.input.value = "";
        var data = {
          id_card: this.id,
          text_card: this.input.value,
        };
        console.log("data");
        console.log(data);
        $.ajax({
          type: "POST",
          url: "/broad/create_card",
          data: data,
          dataType: "json",
        }).then((data) => {
          this.addToDo.call(this, data["id"], data["description"]);
          this.input.value = "";
        });

        // window.location.reload();
      }
    });

    //Append elements to the to-do list element
    this.todoListElement.append(this.h2);
    this.todoListElement.append(this.divAdd);
    // this.todoListElement.append(this.button);
    this.todoListElement.append(this.div);
    this.todoListElement.classList.add("todoList");
  }

  render() {
    this.createToDoListElement();
    this.place.append(this.todoListElement);

    this.editableTitle = new EditableText(
      this.state.text,
      this.h2,
      this,
      "title",
      "input",
      "h2",
      this.id
    );
  }
}

class Card {
  constructor(text, place, todoList, id, description, endDate = "") {
    this.place = place;
    this.todoList = todoList;
    this.state = {
      text: text,
      endDate: endDate,
      description: description,
      //mảng gồm đối tượng checklist ntn{ title: "xin chào", checked: "checked", id_checklist:'id' }
      checklist: [],
      comments: [],
      members: [],
    };
    this.id = id;
    this.render();
    LetterAvatar.transform();
    // hien thi check list ra ben ngoai
    var id_on_checklis = {
      id: this.id,
    }; // goi api dua ve tim kiem theo id va lay du lieu len
    $.ajax({
      type: "POST",
      url: "/api/checklist",
      data: id_on_checklis,
      dataType: "json",
    }).then((data) => {
      data.forEach((element) => {
        var check_obj = {
          title: element["checklist_name"],
          checked: element["tick"],
          id_checklist: element["id_checklist"],
        }; //dua check list vao mang
        this.state.checklist.unshift(check_obj);
      });
      this.divBottom.innerHTML = this.addContentBottom();
    });
  }

  getCountChecked() {
    let count = 0;
    this.state.checklist.forEach((c) => {
      if (c.checked == "checked") count++;
    });
    return count;
  }
  render() {
    this.card = document.createElement("li");
    this.card.classList.add("card-item");
    this.card.setAttribute("id", "id_on_card/" + this.id);
    this.card.addEventListener("click", (e) => {
      if (e.target != this.deleteButton) {
        this.showMenu.call(this);
      }
    });
    // console.log(this.id)
    this.divTop = document.createElement("div");
    this.divBottom = document.createElement("div");
    this.p = document.createElement("p");
    this.p.innerText = this.state.text;
    this.divTop.className = "content-top";
    this.divBottom.className = "content-bottom";
    this.divBottom.innerHTML = this.addContentBottom();
    this.deleteButton = document.createElement("button");
    this.deleteButton.innerText = "X";
    this.deleteButton.addEventListener("click", () => {
      this.deleteCard.call(this);
      var data = {
        id: this.id,
      };
      $.ajax({
        type: "POST",
        url: "/broad/delete_card",
        data: data,
        dataType: "json",
      });
    });
    this.divTop.append(this.p);
    this.divTop.append(this.deleteButton);

    this.card.append(this.divTop);
    this.card.append(this.divBottom);

    this.place.append(this.card);

    var date_ = {
      id: this.id,
    };
    $.ajax({
      type: "POST",
      url: "/api/date_detail_card",
      data: date_,
      dataType: "json",
    }).then((data) => {
      var start = data["start"];
      if (start == null) start = "";
      var end = data["end"];
      if (end == null) end = "";
      this.state.endDate = formatMinDate(new Date(end));
      this.divBottom.innerHTML = this.addContentBottom();
      $(".start button").text(formatDate(new Date(start)));
      $(".end button").text(formatDate(new Date(end)));
    });

    var data_id = {
      id: this.id,
    };
    // su dung api de truyen ve id card va lay len data chua thong tin comment
    $.ajax({
      type: "POST",
      url: "/api/comment",
      dataType: "json",
      data: data_id,
    }).then((data) => {
      data.forEach((element) => {
        var comment = {
          content: element["text_comment"],
          username: element["username"],
          date: element["date"],
        };
        // dua du lieu vao mang
        this.state.comments.push(comment);
      });
    });
  }

  addContentBottom() {
    return (
      `
        <ul class="nav">
          <li class="nav-item disabled date">
              <i class="fas fa-hourglass-start"></i><span>` +
      this.state.endDate +
      `</span></li>
          <li class="nav-item disabled number-comment" >
              <i class="fas fa-comments"></i> <span>` +
      this.state.comments.length +
      `</span>
          </li>
          <li class="nav-item disabled number-check">
              <i class="far fa-check-square"></i>
              <span class="checked">` +
      this.getCountChecked() +
      `</span>/<span class="sum">` +
      this.state.checklist.length +
      `</span>
          </li>
        </ul>
        `
    );
  }

  show_memberOfCard(fullname, id) {
    let li = document.createElement("li");
    // li.setAttribute('class', 'dropdown-item member-list');
    li.className = "dropdown-item member-list";
    li.setAttribute("style", "position: relative;");
    let div1 = document.createElement("div");
    //  div1.setAttribute('class', 'intro');
    div1.className = "intro";
    div1.setAttribute("id", "users" + id);
    div1.setAttribute("style", "margin-top: 10px;");
    let div2 = document.createElement("div");
    let span = document.createElement("span");
    // span.setAttribute('class', 'add_card_member');
    span.className = "add_card_member";
    let i = document.createElement("i");
    // i.setAttribute('class', 'fas fa-plus');
    i.className = "fas fa-plus";
    i.setAttribute("style", "color:gray;");
    span.append(i);
    let div3 = document.createElement("div");
    // div3.setAttribute('class', 'name');
    div3.className = "name";
    div3.innerText = fullname;
    //div2.setAttribute('class', 'infor');
    div2.className = "infor";
    let img = document.createElement("img");
    //img.setAttribute('class', 'round icon-menu');
    img.className = "round icon-menu";
    img.setAttribute("width", "30");
    img.setAttribute("height", "30");
    img.setAttribute("avatar", fullname);
    // img.setAttribute('src', '/images/default_avatar.png')
    div2.append(div3);
    div1.append(img);
    div1.append(div2);
    div1.append(span);
    li.append(div1);
    LetterAvatar.transform();
    return li;
    LetterAvatar.transform();
  }

  deleteCard() {
    this.card.remove();
    let i = this.todoList.cardArray.indexOf(this);
    this.todoList.cardArray.splice(i, 1);
  }

  showMenu() {
    //Create elements
    this.menu = document.createElement("div");
    this.menuContainer = document.createElement("div");
    this.menuTitle = document.createElement("div");
    this.menuMember = document.createElement("ul");
    this.menuDescription = document.createElement("div");
    this.commentsInput = document.createElement("input");
    this.commentsButton = document.createElement("button");
    this.menuComments = document.createElement("div");
    this.menuChecklist = document.createElement("div");
    this.menuLeft = document.createElement("div");
    this.menuRight = document.createElement("div");
    this.progressBar = document.createElement("div");
    this.checklist = document.createElement("div");
    this.formCheckbox = document.createElement("form");
    this.ulCheckbox = document.createElement("ul");
    //Add class names
    this.menuChecklist.className = "menuChecklist checklist";
    this.menu.className = "menu row";
    this.menuMember.className = "menuMember list-group list-group-horizontal";
    this.menuContainer.className = "menuContainer";
    this.menuTitle.className = "menuTitle";
    this.menuDescription.className = "menuDescription";
    this.menuComments.className = "menuComments";
    this.commentsInput.className = "commentsInput comment";
    this.commentsButton.className = "commentsButton btn-save";
    this.menuRight.className = "menu-right col-sm-4";
    this.menuLeft.className = "menu-left col-sm-8";
    //Add inner Text
    this.progressBar.innerHTML = `
      <div class="progressbar-container">
        <div class="progressbar-bar"></div>
        <div class="progressbar-label"></div>
      </div> `;
    this.menuRight.innerHTML = ` <nav>
      <ul>
      <li>
      <div class="dueDate">
        <div class="start row" style="margin-bottom:5px;">
          <div class="label" style="flex: 0 0 50px;  padding-top:10px; color:green;">Start: </div>
          <button disabled="disabled" class="btn btn-light" style="flex: 0 0 200px; color:green;"></button>
        </div>
        <div class="end row" >
          <div class="label" style="flex: 0 0 50px;  padding-top:10px; color:red;">End: </div>
          <button disabled="disabled" class="btn btn-light" style="flex: 0 0 200px; color:red;"></button>
        </div>
      </div>
    </li>
        <li class="title-select">
            ADD TO CARD
        </li>
        <li class="select-menu">
        <div class="dropdown">
        <button type="button" class="btn btn-light dropdown-toggle" id="btn-member" data-toggle="dropdown">
        <i class="fas fa-user"></i> Members
        </button>
        <div class="dropdown-menu" style= "width :100%;">
                <div class="form-group" style="margin-left: 10px; margin-right: 10px;">
                <input type="text" class="form-control" placeholder="Search members" id="searchUser" autocomplete="off">
                </div> 
                <ul id="users_card">

                </ul>
                <ul id="usersmember" style="height:200px;overflow:auto;">
                    <li class="dropdown-item member-list" style="position: relative;">.
                      <div class="intro" id="users1" style="margin-top: 10px;">
                          <img class="round icon-menu" width="30" height="30" avatar="Lê Đình Tài">
                          <div class="infor">
                            <div class="name">Lê Đình Tài</div>
                          </div>
                          <span class='add_card_member'><i class="fas fa-plus" style="color:gray;"></i></span>
                      </div>
                  </li>
                  <li class="title-select"> MEMBER CARD </li>
                  <li class="dropdown-item member-card" style="position: relative;">
                      <div class="intro" id="users2" style="margin-top: 10px;">
                          <img class="round icon-menu" width="30" height="30" avatar="Lê Đình Tài">
                          <div class="infor">
                            <div class="name">Siêu nhân đỏ</div>
                          </div>
                          <span class='delete_card_member' style="position:absolute;top:10px;right:4px;">x</span>
                      </div>
                  </li>
                  <li class="dropdown-item member-card" style="position: relative;">
                      <div class="intro" id="users2" style="margin-top: 10px;">
                          <img class="round icon-menu" width="30" height="30" avatar="Lê Đình Tài">
                          <div class="infor">
                            <div class="name">Siêu nhân đỏ</div>
                          </div>
                          <span class='delete_card_member' style="position:absolute;top:10px;right:4px;">x</span>
                      </div>
                  </li>
                </ul>
        </div>
      </div>
        </li>
        <li class="select-menu">
        <div class="dropdown">
            <button type="button"  id="btn-check" class="btn btn-light dropdown-toggle" data-toggle="dropdown">
            <i class="fas fa-calendar-check"></i> Checklist
            </button>
          <div class="dropdown-menu">
              <div class="form-group" style="margin-left: 10px; margin-right: 10px;">
                  <input type="text" class="form-control" placeholder="Title..." id="checkboxInput">
                  <button class="btn btn-success" style="text-align: center; margin-top: 10px;" id="addCheckbox">Add checklist</button>
              </div>
          </div>
        </div>
        </li>
        <li class="select-menu">
        <div class="dropdown">
          <button type="button" class="btn btn-light dropdown-toggle" id="btn-due" data-toggle="dropdown">
              <i class="far fa-calendar-alt"></i> Due Date
          </button>
          <div class="dropdown-menu">
              <ul style="flex: 1 0 220px; text-align: left;">
                <li>
                  <label style="justify-content: left; margin-left: 10px;">Start Date:</label>
                  <input id="startDate" name="startDate" type="text" class="form-control" style="margin:10px; width:200px;" autocomplete="off"/>
                </li>
                <li>
                  <label style="justify-content: left; margin-left: 10px;">End Date:</label>
                  <input id="endDate" name="endDate" type="text" class="form-control" style="margin: 10px; width:200px;" autocomplete="off"/>
                </li>
              </ul>
              <button class="btn btn-success" id="btnDueDate" style="text-align: center; margin: 10px; width:200px;">Ok</button>
          </div>
          </div>
          </li>
      </ul>
      </nav>`;

    this.commentsButton.innerText = "Add";
    this.commentsInput.placeholder = "Write a comment...";

    //Event listeners
    this.menuContainer.addEventListener("click", (e) => {
      console.log(e.target);

      if (e.target.classList.contains("menuContainer")) {
        this.menuContainer.remove();
      }
    });

    this.commentsButton.addEventListener("click", () => {
      if (this.commentsInput.value != "") {
        $.ajax({
          type: "GET",
          url: "/api/get_username",
        }).then((data) => {
          debugger;
          console.log(data);
          var today = new Date();
          var date =
            today.getFullYear() +
            "-" +
            today.getMonth() +
            "-" +
            today.getDate();
          var hour = today.getHours() + ":" + today.getMinutes();
          // console.log(date + ' ' + hour)
          var comment = {
            username: data,
            content: this.commentsInput.value,
            date: date + " " + hour,
          };
          var data_comment = {
            id: this.id,
            username: data,
            date: date + " " + hour,
            text: this.commentsInput.value,
          };

          console.log(comment);
          this.state.comments.unshift(comment);
          $.ajax({
            type: "POST",
            url: "/api/insert_comment",
            data: data_comment,
            dataType: "json",
          });
          this.divBottom.innerHTML = this.addContentBottom();
          this.renderComments();
          this.commentsInput.value = "";
        });
      }
    });

    //Append
    this.menu.append(this.menuLeft);
    this.menu.append(this.menuRight);
    this.menuLeft.append(this.menuTitle);
    this.menuLeft.append(this.menuMember);
    this.menuLeft.append(this.progressBar);
    this.menuLeft.append(this.menuDescription);
    this.menuLeft.append(this.menuChecklist);
    this.menuLeft.append(this.commentsInput);
    this.menuLeft.append(this.commentsButton);
    this.menuLeft.append(this.menuComments);
    this.formCheckbox.append(this.ulCheckbox);
    this.menuChecklist.append(this.formCheckbox);
    this.menuContainer.append(this.menu);
    root.append(this.menuContainer);

    this.editableDescription = new EditableText(
      this.state.description,
      this.menuDescription,
      this,
      "description",
      "textarea",
      "p",
      this.id
    );
    this.editableTitle = new EditableText(
      this.state.text,
      this.menuTitle,
      this,
      "text",
      "input",
      "h5",
      this.id
    );

    this.renderComments();
    this.renderChecklist();
    this.renderMembers();

    this.btnDueDate = document.getElementById("btnDueDate");
    this.showmember = document.getElementById("usersmember");
    this.showmember.innerHTML = "";
    this.showmember.innerText = "    Member in this card";
    //this.showmember.innerHTML = '';

    var data6 = {
      id_card: this.id,
    };
    $.ajax({
      url: "/api/memberOfCard",
      type: "POST",
      data: data6,
      dataType: "json",
    }).then((data9) => {
      console.log(data9.length);
      data9.forEach((element) => {
        this.showmember.append(
          this.show_memberOfCard(element["username"], element["id"])
        );
        LetterAvatar.transform();
      });
    });

    //////////////////////////////////////

    var p = this.id;

    $("#searchUser").on("keydown", function (e) {
      if (e.which == 13) {
        e.preventDefault();
        var search = $("#searchUser").val();
        if (search != "") {
          var data = {
            name_search: search,
            id_card: p,
          };
          $.ajax({
            type: "POST",
            url: "/api/invite_member_join_card",
            data: data,
            dataType: "json",
          })
            .then((data) => {
              // console.log(data);
              let ul = document.getElementById("users_card");
              data.forEach((element) => {
                let li = document.createElement("li");
                ul.append(li);
                li.classList.add("dropdown-item");
                li.classList.add("inviteMemberjoincard");
                let div = document.createElement("div");
                li.append(div);
                div.classList.add("intro");
                div.setAttribute("style", "margin-top: 10px;");
                let img = document.createElement("img");
                div.append(img);
                img.classList.add("round");
                img.classList.add("icon-menu");
                img.setAttribute("width", "30");
                img.setAttribute("height", "30");
                img.setAttribute("avatar", element["username"]);
                let div2 = document.createElement("div");
                div.append(div2);
                div2.classList.add("infor");
                let div3 = document.createElement("div");
                div2.append(div3);
                div3.classList.add("name");
                div3.setAttribute("id", "name");
                div3.append(element["username"]);

                LetterAvatar.transform();
              });

              let inviteInput = document.getElementById("searchUser");
              inviteInput.value = "";
              var member_card = document.getElementsByClassName(
                "inviteMemberjoincard"
              );
              // console.log(member)
              var members_card = [];
              // var i;
              for (i = 0; i < member_card.length; i++) {
                members_card.push(member_card[i]);
              }
              var i = 0;
              members_card.forEach((element) => {
                // console.log(element);
                element.addEventListener("click", () => {
                  var username =
                    element.lastChild.lastChild.lastChild.textContent;
                  var data = {
                    username: username,
                    id_card: p,
                  };
                  $.ajax({
                    type: "POST",
                    url: "/api/invitejoincard",
                    data: data,
                    dataType: "json",
                  });
                });
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });

    $(document).ready(function () {
      $(".inviteMemberjoincard").click(function (e) {
        e.preventDefault();
        console.log("e: " + e);
      });
    });
    //////////////////////////////////
    //lay thong tin ve startDate va endDate
    var date_ = {
      id: this.id,
    };
    $.ajax({
      type: "POST",
      url: "/api/date_detail_card",
      data: date_,
      dataType: "json",
    }).then((data) => {
      this.divBottom.innerHTML = this.addContentBottom();

      var start = data["start"];
      console.log(start);
      if (start == null) start = "";
      else $(".start button").text(formatDate(new Date(start)));

      var end = data["end"];
      console.log(end);
      if (end == null) end = "";
      else {
        $(".end button").text(formatDate(new Date(end)));
        this.state.endDate = formatMinDate(new Date(end));
      }
    });

    this.btnDueDate.addEventListener("click", () => {
      var start = $("#startDate").val().trim();
      var end = $("#endDate").val().trim();
      if (start != "" && end != "") {
        var date_1 = {
          id: this.id,
          start: start,
          end: end,
        };
        $.ajax({
          type: "POST",
          url: "/api/update_date_time",
          data: date_1,
          dataType: "json",
        });

        this.state.endDate = formatMinDate(new Date(end));
        this.divBottom.innerHTML = this.addContentBottom();
        $(".start button").text(formatDate(new Date(start)));
        $(".end button").text(formatDate(new Date(end)));
      }
    });

    $(document).ready(function () {
      LetterAvatar.transform();
      $("#searchUser").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#users li.member-list").filter(function (x) {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });
    this.memberList = document.getElementsByClassName("member-list");
    var members = [];
    for (var i = 0; i < this.memberList.length; i++) {
      members.push(this.memberList[i]);
    }
    members.forEach((element) => {
      element.addEventListener("click", () => {
        var name = element.textContent;
        if (!this.state.members.includes(name.trim())) {
          this.state.members.push(name.trim());
          this.renderMembers();
        }
      });
    });
    this.btnChecklist = document.getElementById("addCheckbox");
    this.checklistInput = document.getElementById("checkboxInput");

    this.btnChecklist.addEventListener("click", () => {
      if (this.checklistInput.value.trim() != "") {
        var insert_checklist = {
          id: this.id,
          checklist_name: this.checklistInput.value,
          tick: " ",
        };
        $.ajax({
          type: "POST",
          url: "/api/insert_checklist",
          dataType: "json",
          data: insert_checklist,
        }).then((data) => {
          var checkbox = {
            title: this.checklistInput.value,
            checked: this.checklistInput.checked,
            id_checklist: data["id_checklist"],
          };
          this.state.checklist.unshift(checkbox);
          this.renderChecklist();
          this.divBottom.innerHTML = this.addContentBottom();
          this.checklistInput.value = "";
          checklist();
        });
      }
    });
    // check box
    checklist();
    console.log("OK");
    var count = $("input[type='checkbox']").length;
    console.log("count");
    console.log(this.state.checklist);
    var checkboxs = [];
    for (var i = 0; i < this.state.checklist.length; i++) {
      console.log(this.state.checklist[i]["id_checklist"]);
      var tick = "tick " + this.state.checklist[i]["id_checklist"];
      var checkbox = document.getElementById(tick);

      checkboxs.push(checkbox);
    }
    console.log("checkboxs");
    console.log(checkboxs);
    checkboxs.forEach((element) => {
      element.addEventListener("click", () => {
        var id_checklist = element.id;
        var data = {
          id_checklist: id_checklist,
        };
        $.ajax({
          type: "POST",
          url: "/api/update_checkbox",
          data: data,
          dataType: "json",
        });
        id_checklist = id_checklist.split(" ")[1];
        for (var i = 0; i < this.state.checklist.length; i++) {
          if (this.state.checklist[i]["id_checklist"] == id_checklist) {
            if (this.state.checklist[i]["checked"] != "checked") {
              this.state.checklist[i]["checked"] = "checked";
            } else {
              this.state.checklist[i]["checked"] = " ";
            }
          }
        }
        this.divBottom.innerHTML = this.addContentBottom();
        checklist();
      });
    });
    dateTime();
  }

  renderMembers() {
    let members = Array.from(this.menuMember.childNodes);
    members.forEach((member) => {
      member.remove();
    });
    let p = this.id;
    let data1999 = {
      id_card: p,
    };
    $.ajax({
      type: "POST",
      url: "/api/memberOfCard",
      data: data1999,
      dataType: "json",
    }).then((data) => {
      data.forEach((member) => {
        $(".menuMember").append(this.formatMember(member["username"]));
        LetterAvatar.transform();
      });
    });
    LetterAvatar.transform();
  }

  //Chỉnh comment
  renderComments() {
    let currentCommentsDOM = Array.from(this.menuComments.childNodes);
    currentCommentsDOM.forEach((commentDOM) => {
      commentDOM.remove();
    });
    this.state.comments.forEach((comment) => {
      // new Comment(comment, this.menuComments, this);
      new Comment(
        comment["content"],
        this.menuComments,
        this,
        comment["username"],
        formatDate(new Date(comment["date"]))
      );
    });
  }
  formatMember(name) {
    return `
    <li class="list-group-item" style="background: transparent;border: none;">
      <img class="round icon-menu" style="margin-top:-9px; margin-left:0px;" width="30" height="30" avatar="${name}">
    </li>
    `;
  }
  //tạo checklist
  renderChecklist() {
    console.log(this.state.checklist);
    let currentChecklistDOM = Array.from(this.ulCheckbox.childNodes);
    currentChecklistDOM.forEach((item) => {
      item.remove();
    });
    this.state.checklist.forEach((checkbox) => {
      console.log(checkbox);
      new Checklist(
        checkbox.title,
        this.ulCheckbox,
        this,
        checkbox.checked,
        checkbox.id_checklist
      );
    });
  }
}

// để chỉnh sửa khi click vào text
class EditableText {
  constructor(text, place, card, property, typeOfInput, element = "p", id) {
    this.text = text;
    this.elementContainer = element;
    this.place = place;
    this.card = card;
    this.property = property;
    this.typeOfInput = typeOfInput;
    this.render();
    this.id = id;
  }

  render() {
    this.div = document.createElement("div");
    this.p = document.createElement(this.elementContainer);
    this.p.innerText = this.text;

    this.p.addEventListener("dblclick", () => {
      this.showEditableTextArea.call(this);
    });

    this.div.append(this.p);
    this.place.append(this.div);
  }

  showEditableTextArea() {
    let oldText = this.text;

    this.input = document.createElement(this.typeOfInput);
    this.saveButton = document.createElement("button");

    this.p.remove();
    this.input.value = oldText;
    this.saveButton.innerText = "Save";
    this.saveButton.className = "btn-save";
    this.saveButton.setAttribute("id", "change_text_card/" + this.id);
    this.input.classList.add("comment");

    this.saveButton.addEventListener("click", () => {
      console.log("OK");
      // debugger;
      var data = {
        id: this.id,
        text: this.input.value,
      };

      console.log(data);
      if (this.property == "text") {
        $.ajax({
          type: "POST",
          url: "/api/change_text_card",
          data: data,
          dataType: "json",
        });
      } else if (this.property == "description") {
        $.ajax({
          type: "POST",
          url: "/api/change_description",
          data: data,
          dataType: "json",
        });
      } else if (this.property == "title") {
        $.ajax({
          type: "POST",
          url: "/api/change_title",
          data: data,
          dataType: "json",
        });
      }

      this.text = this.input.value;
      this.card.state[this.property] = this.input.value;
      if (this.property == "text") {
        this.card.p.innerText = this.input.value;
      }
      $.ajax({});
      this.div.remove();
      this.render();
    });

    function clickSaveButton(event, object) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        object.saveButton.click();
      }
    }

    this.input.addEventListener("keyup", (e) => {
      if (this.typeOfInput == "input") {
        clickSaveButton(e, this);
      }
    });

    this.div.append(this.input);

    if (this.typeOfInput == "textarea" || this.typeOfInput == "input") {
      this.div.append(this.saveButton);
    }

    this.input.select();
  }
}

class Comment {
  //chưa code xong, cần tạo đối tượng user
  constructor(text, place, card, user, date) {
    this.text = text;
    this.place = place;
    this.card = card;
    this.user = user;
    this.date = date;
    this.render();
  }

  render() {
    this.div = document.createElement("div");
    this.div.className = "comment";
    this.div.innerHTML = this.formatComment();
    this.place.append(this.div);
    LetterAvatar.transform();
  }
  formatComment() {
    return (
      `<div class="media">
  <img class="round mr-3 mt-3" width="30" height="30" avatar="` +
      this.user +
      `">
  <div class="media-body">
      <h6>` +
      this.user +
      `<small><i>   ` +
      this.date +
      `</i></small></h6>
      <p>
      ` +
      this.text +
      `
      </p>
  </div>
  </div>`
    );
  }
}

class Checklist {
  constructor(title, place, card, checked, id_checklist) {
    this.state = {
      text: title,
      checked: checked,
    };
    this.title = title;
    this.place = place;
    this.card = card;
    this.id_checklist = id_checklist;
    this.render();
  }
  render() {
    var lineThrough =
      this.state.checked == "checked" ? "text-decoration: line-through;" : "";
    this.li = document.createElement("li");
    this.li.className = "row";
    this.li.innerHTML =
      `
    <input type="checkbox" id = 'tick ` +
      this.id_checklist +
      `' name="box ` +
      this.id_checklist +
      `"class="col-sm-1"/` +
      this.state.checked +
      `>
    <p class="col-sm-11" style="margin-left: -20px; ` +
      lineThrough +
      `">` +
      this.state.text +
      `</p>
  `;
    this.place.append(this.li);
  }
}

//-------------main------------

let addTodoListInput = document.getElementById("addTodoListInput");
let addTodoListButton = document.getElementById("addTodoListButton");
let memberButton = document.getElementById("btn-member");
let checkButton = document.getElementById("btn-check");
let dueButton = document.getElementById("btn-due");
addTodoListButton.addEventListener("click", () => {
  if (addTodoListInput.value.trim() != "") {
    // new todoList(root, addTodoListInput.value);
    var data = {
      titleName: addTodoListInput.value,
    };
    // console.log(data["titleName"]);
    $.ajax({
      type: "POST",
      url: "/broad/createTodo",
      data: data,
      dataType: "json",
    });

    $.ajax({
      type: "GET",
      url: "/api/get_id_title",
    })
      .then((data_id) => {
        var id_card = 0;
        data_id.forEach((element) => {
          id_card = element["id_card"];
        });

        let toto = new todoList(root, data["titleName"], id_card);

        sortTable();

        $(".todoList").draggable();
        $(".todoList").droppable({
          drop: function (event, ui) {
            // lấy ra di của thằng cữ
            var idTaskOld = ui.draggable.attr("id");
            // lấy của thằng cữ
            var idTaskNew = $(this).attr("id");
            var data = {
              id: idTaskOld,
              id_card: idTaskNew,
            };
            $.ajax({
              type: "POST",
              url: "/broad/draggable",
              data: data,
              dataType: "json",
            });
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });

    addTodoListInput.value = "";
  }
});

// 1 mảng li chứa element để click vào thì ra đối tượng cần invite
// input này để tìm trong cơ sở dữ liệu, nhấn enter sẽ lấy ra đối tượng đổ vào member có class là inviteMember. dùng ejs thì cộng chuỗi...
var button_1 = document.getElementById("inviteTeam");
button_1.addEventListener("click", () => {
  let ul = document.getElementById("users");
  ul.innerText = "";
});

$("#inviteInput").on("keydown", function (e) {
  if (e.which == 13) {
    e.preventDefault();

    var search = $("#inviteInput").val();
    if (search != "") {
      var data = {
        name_search: search,
      };
      $.ajax({
        type: "POST",
        url: "/api/search",
        data: data,
        dataType: "json",
      })
        .then((data) => {
          // console.log(data);
          let ul = document.getElementById("users");
          data.forEach((element) => {
            let li = document.createElement("li");
            ul.append(li);
            li.classList.add("dropdown-item");
            li.classList.add("inviteMember");
            let div = document.createElement("div");
            li.append(div);
            div.classList.add("intro");
            div.setAttribute("style", "margin-top: 10px;");
            let img = document.createElement("img");
            div.append(img);
            img.classList.add("round");
            img.classList.add("icon-menu");
            img.setAttribute("width", "30");
            img.setAttribute("height", "30");
            img.setAttribute("avatar", element["username"]);
            let div2 = document.createElement("div");
            div.append(div2);
            div2.classList.add("infor");
            let div3 = document.createElement("div");
            div2.append(div3);
            div3.classList.add("name");
            div3.setAttribute("id", "name");
            div3.append(element["username"]);

            LetterAvatar.transform();
          });

          let inviteInput = document.getElementById("inviteInput");
          inviteInput.value = "";
          var member = document.getElementsByClassName("inviteMember");
          // console.log(member)
          var members = [];
          // var i;
          for (i = 0; i < member.length; i++) {

            members.push(member[i]);
          }
          var i = 0;
          members.forEach((element) => {
            element.addEventListener("click", () => {
              var username = element.lastChild.lastChild.lastChild.textContent;
              var data = {
                username: username,
              };
              $.ajax({
                type: "POST",
                url: "/api/invite",
                data: data,
                dataType: "json",
              });
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

// dua du lieu vao broad
$.ajax({
  url: "/api/broad",
  type: "get",
})
  .then((data) => {
    // lay du lieu tu textCard
    let titleBoard = document.getElementById("titleBoard");
    titleBoard.innerText = data["broadName"];
    $.ajax({
      url: "/api/textCard",
      type: "get",
    })
      .then((data1) => {
        var data_task = data;
        // dua textCard vao data_task['title']
        for (var i = 0; i < data_task["title"].length; i++) {
          var id_card = data_task["title"][i]["id_card"];
          // bien a de chua thong tien cac task cung id_card
          var a = data1.filter(function (x) {
            return x["id_card"] == id_card;
          });
          data_task["title"][i]["text_card"] = a[0]["text_card"];
          data_task["title"][i]["id"] = a[0]["id"];
        }

        var title = data_task["title"];

        title.forEach((element) => {
          let todo = new todoList(root, element["title"], element["id_card"]);

          try {
            for (var i = 0; i < element["text_card"].length; i++) {
              var data4 = {
                id: element["id"][i],
              };
              $.ajax({
                type: "POST",
                url: "/api/get_description",
                data: data4,
                dataType: "json",
              }).then((data) => {
                todo.input.value = data[0]["text_card"];
                todo.addToDo(data[0]["id"], data[0]["description"]);
                todo.input.value = "";
              });
            }
          } catch {}
        });

        // ham de bo sung class cho the ul
        $(function () {
          $('ul[id^="sort"]')
            .sortable({
              connectWith: ".sortable",
            })
            .disableSelection();
        });

        $(".todoList").draggable();
        $(".todoList").droppable({
          drop: function (event, ui) {
            // lấy ra di của thằng cữ
            var idTaskOld = ui.draggable.attr("id");

            // lấy của thằng cữ
            var idTaskNew = $(this).attr("id");

            var data = {
              id: idTaskOld,
              id_card: idTaskNew,
            };
            $.ajax({
              type: "POST",
              url: "/broad/draggable",
              data: data,
              dataType: "json",
            });
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

$.ajax({
  type: "GET",
  url: "/api/favourite",
})
  .then((data) => {
    if (data[0]["favourite"] == "0") {
      $("i.fa-star").css("color", "black");
    } else {
      $("i.fa-star").css("color", "rgb(236, 142, 19)");
    }
  })
  .catch((err) => {
    console.log(err);
  });

$(function () {
  $("#btnStar").click(function () {
    if ($("i.fa-star").css("color") == "rgb(236, 142, 19)") {
      $("i.fa-star").css("color", "black");
      var data = {
        favourite: "0",
      };
      $.ajax({
        type: "POST",
        url: "/broad/update_favourite",
        data: data,
        dataType: "json",
      });
    } else {
      $("i.fa-star").css("color", "rgb(236, 142, 19)");
      var data = {
        favourite: "1",
      };
      $.ajax({
        type: "POST",
        url: "/broad/update_favourite",
        data: data,
        dataType: "json",
      });
    }
  });
  // chỉnh private public
  // $("#btnModifyTeam").click(function() {
  //     if ($("#btnModifyTeam").text() == "Private Team")
  //         $("#btnModifyTeam").text("Public Team");
  //     else $("#btnModifyTeam").text("Private Team");
  // });
  sortTable();

  $(".todoList").draggable();
  $(".todoList").droppable({
    drop: function (event, ui) {
      // lấy ra di của thằng cữ
      var idTaskOld = ui.draggable.attr("id");

      // lấy của thằng cữ
      var idTaskNew = $(this).attr("id");
    },
  });
});
let member1 = document.getElementById("member1");

function showMember(user_name) {
  let div1 = document.createElement("div");
  div1.className = "intro dropdown-item";
  div1.setAttribute("style", "margin-top: 10px;");
  let img = document.createElement("img");
  img.className = "round icon-menu";
  img.setAttribute("width", "30");
  img.setAttribute("height", "30");
  //img.setAttribute('src', "/images/default_avatar.png");
  img.setAttribute("avatar", user_name);
  let div2 = document.createElement("div");
  div2.className = "infor";
  let div3 = document.createElement("div");
  div3.className = "name";
  div3.innerText = user_name;
  div2.append(div3);
  div1.append(img);
  div1.append(div2);
  member1.append(div1);
  LetterAvatar.transform();
}

let button1 = document.getElementById("memberTeam");

button1.addEventListener("click", () => {
  member1.innerHTML = "";
  $.ajax({
    url: "/api/memberteam",
    type: "get",
  })
    .then((data) => {
      // console.log(data);
      data.forEach((element) => {
        showMember(element["username"]);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// check box
checklist();
sortTable();
dateTime();
