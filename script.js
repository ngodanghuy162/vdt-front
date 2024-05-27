const url =  'http://192.168.1.105:8080/vdt/';
let users = [];
let chosenUserId = 0;
let editMode = false;

document.addEventListener('DOMContentLoaded', function () {
    fetchUsers();
});

function fetchUsers() {
    fetch(url + 'all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            users = data;
            renderUserTable(users);
        })
        .catch(error => console.error('Error fetching users:', error));
}

function renderUserTable() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; // Xóa các hàng hiện có

    let index = 0; // Khởi tạo biến để theo dõi chỉ mục
    users.forEach(user => {
        index++;
        const newRow = `<tr>
            <td>${index}</td>  
            <td>${user.name}</td>
            <td>${user.gender}</td>
            <td>${user.school}</td>
            <td><button onclick="editUser(${user.id})">Chỉnh sửa</button></td>
            <td><button onclick="viewDetails(${user.id})">Xem chi tiết</button></td>
            <td><button onclick="deleteUser(${user.id})">Xóa</button></td>
        </tr>`;
        userTableBody.insertAdjacentHTML('beforeend', newRow);
    });
}

function editUser(userId) {
    chosenUserId = userId;
    populateForm(userId, false);
    editMode = true;
    showEdit();
}

function viewDetails(userId) {
    populateForm(userId, true);
    showDetails();
}

function populateForm(userId, readOnly) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        console.log("Not found");
        return;
    } else {
console.log(user);
    }
    document.getElementById('name').value = user.name;
    document.getElementById('birth').value = user.birth;
    document.getElementById('phone').value = user.phone;
    document.getElementById('email').value = user.email;
    document.getElementById('gender').value = user.gender;
    document.getElementById('school').value = user.school;
    document.getElementById('country').value = user.country;

    document.getElementById('name2').value = user.name;
    document.getElementById('birth2').value = user.birth;
    document.getElementById('phone2').value = user.phone;
    document.getElementById('email2').value = user.email;
    document.getElementById('gender2').value = user.gender;
    document.getElementById('school2').value = user.school;
    document.getElementById('country2').value = user.country;
    const inputs = document.querySelectorAll('#detailsForm input, #userForm input');
    inputs.forEach(input => input.readOnly = readOnly);
}

function deleteUser(userId) {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng có ID: " + userId + " không?")) {
        fetch(url + 'delete/' + userId, {
            method: 'DELETE',
        })
        .then(response => {
            return response.status;
        })
        .then(data => {
            if (data == "200") {
                alert("Success");
                const index = users.findIndex(user => user.id === userId);
 
                if (index !== -1) {

                users.splice(index, 1);
            }
            renderUserTable(users);
            }
            else if (data == "404") {
                alert("User not found");
            } else {
                alert("Something failed");
            }
        })
        .catch(error => {
            console.error('Có lỗi xảy ra:', error);
            alert("Đã xảy ra lỗi khi xóa người dùng.");
        });
    }
}

function showForm() {
    console.log("show");
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('overlay1').style.display = 'block';
}

function closeForm() {
    console.log("close");
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('overlay1').style.display = 'none';
    document.getElementById('userForm').reset();
    editMode = false;
}

function showEdit() {
    document.getElementById('overlay2').style.display = 'block';
    document.getElementById('editModal').style.display = 'block';
}

function closeEdit() {
    document.getElementById('overlay2').style.display = 'none';
    document.getElementById('editModal').style.display = 'none';
}


function showDetails() {
    document.getElementById('overlay3').style.display = 'block';
    document.getElementById('detailModal').style.display = 'block';
}

function closeDetails() {
    document.getElementById('overlay3').style.display = 'none';
    document.getElementById('detailModal').style.display = 'none';
}

function updateUser(event) {
    console.log("update user");
    event.preventDefault();

    const user = users.find(u => u.id === chosenUserId);

    const name = document.getElementById('name').value;
    const birth = document.getElementById('birth').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const gender = document.getElementById('gender').value;
    const school = document.getElementById('school').value;
    const country = document.getElementById('country').value;

    user.name = name;
    user.birth = birth;
    user.phone = phone;
    user.email = email;
    user.gender = gender;
    user.school = school;
    user.country = country;

    const userJson = JSON.stringify(user);

    fetch(url + 'update/' + chosenUserId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: userJson
    })

    .then(response => {
        if (response.ok) {
            console.log('User updated successfully!');
            closeForm();
            const index = users.findIndex(user => user.id === userId);
            if (index >= 0 && index < users.length) {
                users[index] = userJson; 
            } else {
                console.log("Not found user");
            }
            renderUserTable();
        } else {
            console.error('Failed to update user:', response.statusText);
            alert('Error updating user. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('An error occurred while updating user. Please check your connection and try again.');
    });
}

function addUser(event) {
    console.log("add user");
    event.preventDefault();

    const name = document.getElementById('name1').value;
    const birth = document.getElementById('birth1').value;
    const phone = document.getElementById('phone1').value;
    const email = document.getElementById('email1').value;
    const gender = document.getElementById('gender1').value;
    const school = document.getElementById('school1').value;
    const country = document.getElementById('country1').value;
    const newUser = 
    {
        "name": name,
        "birth": birth,
        "email": phone,
        "phone": email,
        "gender": gender,
        "school": school,
        "country": country
    }
    fetch(url + 'create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
})
    .then(response => {
        if (response.ok) {
            console.log('User created successfully!');
            closeForm();
            users.push(newUser);
            renderUserTable();
        } else {
            console.error('Failed to create user:', response.statusText);
            alert('Error creating user. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error creating user:', error);
        alert('An error occurred while creating user. Please check your connection and try again.');
    });
}