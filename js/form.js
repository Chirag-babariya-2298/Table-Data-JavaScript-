let table = document.querySelector("tbody");
let allInput = document.querySelectorAll(".input_group");
let profileImg = document.querySelector("#profileImg");
let data = [];
let id = 0;
let editId = 0;
let profile = document.querySelector("#profile");

let saveData = async () => {
    let obj = {};
    allInput.forEach((element, index) => {

        if (element.type == "radio") {
            if (element.checked) {
                obj[element.name] = element.value;
            }
            let errorMsg = document.querySelector(`span[name=${element.name}]`);
            if (obj[element.name] == undefined || obj[element.name] == '') {
                errorMsg.style.display = 'block';
            } else {
                errorMsg.style.display = 'none';
            }


        } else if (element.type == "checkbox") {
            if (obj[element.name] == undefined) {
                obj[element.name] = [];
            }
            if (element.checked) {
                obj[element.name].push(element.value);
            }
            let errorMsg = document.querySelector(`span[name=${element.name}]`);
            if (obj[element.name] == undefined || obj[element.name] == '') {
                errorMsg.style.display = 'block';
            }
             else {
                errorMsg.style.display = 'none';
            }
        }
        else {
            if (element.value == "") {
                let errorMsg = document.querySelector(`span[name=${element.name}]`);
                errorMsg.style.display = 'block';
            }
            obj[element.name] = element.value;
        }

    })
    if (profile.files[0]) {
        obj.profile = await toBase64(profile.files[0]);
    } else {
        obj.profile = ""
    }
    if (editId == 0) {
        id++;
        obj.id = id;
        data.push(obj);
    } else {
        let index = data.findIndex((ele) => ele.id == editId);
        obj.id = editId;
        if (!profile.files[0]) {
            obj.profile = profileImg.src;
        }
        data.splice(index, 1, obj);
        editId = 0;
    }
    printData();
    document.querySelector("form").reset();
    profileImg.style.display = "none"
}

let previewImage = async (event) => {
    profileImg.style.display = "block";
    profileImg.src = await toBase64(event.files[0])
}


let deleteData = (id) => {
    let index = data.findIndex((ele) => ele.id == id);
    data.splice(index, 1);
    printData();
}

let editData = (id) => {
    editId = id;
    let editObj = data.find((ele) => ele.id == id);
    allInput.forEach((ele, i) => {
        if (ele.type == "radio") {
            if (ele.value == editObj[ele.name]) {
                ele.checked = true;
            }
        } else if (ele.type == "checkbox") {
            if (editObj[ele.name].includes(ele.value)) {
                ele.checked = true;
            }
        } else {
            ele.value = editObj[ele.name];
        }
    })
    profileImg.src = editObj.profile;
    profileImg.style.display = "block";
}

let printData = () => {
    let str = '';
    data.forEach((ele, i) => {
        str += `<tr>
        <td>${ele.id} </td>
        <td><img src=${ele.profile} style="height="100px" width="100px"></td>
        <td>${ele.fname}</td>
        <td>${ele.lname}</td>
        <td>${ele.email}</td>
        <td>${ele.city}</td>
        <td>${ele.gender}</td>
        <td>${ele.shift}</td>
        <td>${ele.hobby}</td>
        <td><button class = "btn btn-success" onclick = "editData(${ele.id})">Edit</button>
        <button class = "btn btn-danger" onclick = "deleteData(${ele.id})">Delete</button></td>
        </tr> `
    });
    table.innerHTML = str;
}

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
