//front-end
//getting DOM inputs
const addAddress = document.querySelector('#addAddress');
const title = document.querySelector('#title')
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const street = document.querySelector('#streetName');
const lghNumber = document.querySelector('#lghNumber');
const city = document.querySelector('#cityName');
const zip = document.querySelector('#zip');
const table = document.querySelector('.table');
const dismissBtn = document.querySelector('#dismiss');
const box = document.querySelector('.box');
const updateAddress = document.querySelector('#updateBtn');

const createButton = (btnClasses, snippetClasses) => {
    const td = document.createElement('td');
    const btn = document.createElement('button');
    btn.setAttribute('class', btnClasses);
    const snippet = document.createElement('i');
    snippet.setAttribute('class', snippetClasses);
    btn.appendChild(snippet);
    td.appendChild(btn);
    return td;
}

const createTR = (address) => {
    const tr = document.createElement('tr');
    tr.setAttribute('class', 'trStyle');
    for (const [key, value] of Object.entries(address)) {
        const td = document.createElement('td');
        if (key == 'id') tr.setAttribute('id', value);
        if (key == 'zip') td.setAttribute('class', 'd-md-none d-lg-table-cell');
        td.textContent = value;
        tr.append(td);
      }
    tr.append(createButton('btn btn-primary', 'fa-regular fa-pen-to-square'));
    tr.append(createButton('btn btn-danger', 'fa-solid fa-trash-can'));
    return tr;
}

const loadAddresses = () => {
    const tbodyEl = document.querySelector('tbody');
    tbodyEl.innerHTML = '';
    fetch('http://localhost:3000/api/addresses')
        .then(response => response.json())
        .then(addresses => {
            addresses.forEach(address => {
                tbodyEl.appendChild(createTR(address));
            })
        })
        .catch( error => console.error('Error:', error));
}

//yellow Add action onClick
addAddress.addEventListener('click', () => {
    const newAddress = {
        title: title.value,
        name: firstName.value,
        lastName: lastName.value,
        street: street.value,
        lgh: lghNumber.value,
        city: city.value,
        zip: zip.value
    };

    fetch('http://localhost:3000/api/addresses/', {
        method: 'POST',
        body: JSON.stringify(newAddress),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
    .then((response) => response.json())
    .catch(error => console.error(error));
    // update results for the user
    loadAddresses();
    // set form to pristine again
    firstName.value = '';
    lastName.value = '';
    street.value = '';
    lghNumber.value = '';
    city.value = '';
    zip.value = '';
});


table.addEventListener('click', (el) => {
    if (el.target.classList.contains('btn-danger') || el.target.classList.contains('fa-trash-can')) {
        let id = el.target.parentElement.parentElement.getAttribute('id');
        id ??= el.target.parentElement.parentElement.parentElement.getAttribute('id');

        fetch(`http://localhost:3000/api/addresses/${id}`, 
                {method: 'DELETE'})
                .then(() => { 
                    loadAddresses();
                })
                .catch(error => console.log('Error:', error));
    }
    if (el.target.classList.contains('btn-primary') || el.target.classList.contains('fa-pen-to-square')) {
        box.style.visibility = 'visible';
        let id = el.target.parentElement.parentElement.getAttribute('id');
        id ??= el.target.parentElement.parentElement.parentElement.getAttribute('id');

        const row = document.getElementById(id);
        const updateFields = document.getElementsByClassName('updateEntry');

        for (let i = 1; i<8; i++) {
            updateFields[i-1].value = row.children[i].textContent;
        }
        updateAddress.setAttribute('id', id);
    }
});

dismissBtn.addEventListener('click', () => {
    box.style.visibility = 'hidden';
});

updateAddress.addEventListener('click', (el) => {
    const id = updateAddress.id;
    const updateTheAddress = {
        title: document.querySelector('#titleUpdate').value,
        name: document.querySelector('#firstNameUpdate').value,
        lastName: document.querySelector('#lastNameUpdate').value,
        street: document.querySelector('#streetNameUpdate').value,
        lgh: document.querySelector('#lghNumberUpdate').value,
        city: document.querySelector('#cityNameUpdate').value,
        zip: document.querySelector('#zipUpdate').value,
    }
    fetch(`http://localhost:3000/api/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateTheAddress),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        })
        .then(() => { 
            box.style.visibility = 'hidden';
            loadAddresses();
        })
        .catch(error => console.error('Error:', error));
});

// adding search functions
const searchBy = document.querySelector('#searchBy');

const filterByName = (criteria) => {
    const filter = searchBy.value.toUpperCase();
    const tr = table.getElementsByTagName("tr");
    let td, txtValue;
    for (let i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[parseInt(criteria)];
        if (td) {
            txtValue = td.textContent || td.innerHTML;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

searchBy.addEventListener('keyup', () => {
    const criteria = document.querySelector('#criteria');
    filterByName(criteria.value);
});

loadAddresses();