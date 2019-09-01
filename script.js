//Создаем кнопки для показа или скрытия колонок
var inner = '<tr>';
for (i = 0; i < 4; i++) {
	inner += "<td class='but'><button onclick='changeView(this)'>-</button></td>";
}
inner += '</tr>';

//Создаем заголовки
var colHeaders = ['Имя (firstName)', 'Фамилия (lastName)', 'Описание (about)', 'Цвет глаз (eyeColor)'];
inner += '<tr>' ;
for (var i in colHeaders) {
	inner += "<th onclick='sort("+i+")'>" + colHeaders[i] + "</th>" ;
}
inner += '</tr>';

//Заполняем ячейки
for (var i in tableData) {
	inner += "<tr onclick='edit(this)'>"
	+ '<td>' + tableData[i].name.firstName + '</td>'
	+ '<td>' + tableData[i].name.lastName + '</td>'
	+ "<td> <div class='about'>"+ tableData[i].about + '</div></td>'
	+ '<td class=' + tableData[i].eyeColor + '>' + tableData[i].eyeColor + '</td>'
	+ '</tr>';
}

var table = document.createElement('table');
table.innerHTML = inner;

//Создаем постраничную навигацию
var page = document.createElement('div');
page.className = 'page';
var nPages = Math.ceil((table.rows.length - 2) / 10);  //nPages - общее количество страниц
for (i = 1; i <= nPages; i++) {
	page.innerHTML += "<a href=''>" + i + "</a>";
}
var curPage = 1;	
//Оставляем только первую страницу
viewPage(curPage);

//Добавляем всё на страницу
document.body.appendChild(table);
document.body.appendChild(page);

//Добавляем обработчик на номера страниц
var links = document.getElementsByTagName('a');
for (i = 0; i < links.length; i++) {
	links[i].addEventListener('click',function(e) {
		e.preventDefault();
		viewPage(this.innerHTML);
	});
}

function viewPage(n) {  //n-текущая страница
	//убираем все записи
	for (i = 2; i < table.rows.length; i++) {
	table.rows[i].style.display = 'none';
	}
	//отображаем только 10 записей текущей страницы
	for (i = (2 + 10*(n-1)); i < (table.rows.length - (nPages-n)*10); i++) {
	table.rows[i].style.display = 'table-row';
	}
	curPage = n;
}

var editForm = document.getElementById('editForm');
//поля формы
var fName = document.getElementById('firstNameField');
var lName = document.getElementById('lastNameField');
var about = document.getElementById('aboutField');
var color = document.querySelectorAll('input[type=radio]');

//функция для отображения формы
function edit(r) {
	var n = r.rowIndex;
	nRow.value = n;
	var ab = table.querySelectorAll('div.about')[n-2];
	var child = r.childNodes;
	fName.value=child[0].innerHTML;
	lName.value=child[1].innerHTML;
	about.value=ab.innerHTML;
	for (i = 0; i < (color.length); i++) {
		if (color[i].value == child[3].innerHTML) {
			color[i].checked = true;
		}
	}
	editForm.style.display='inline-block';
}

//обработчик нажатия на кнопку "Сохранить"
Form.addEventListener('submit',function(e) {
	e.preventDefault();
	var r = table.getElementsByTagName('tr')[nRow.value];
	var ab = table.querySelectorAll('div.about')[nRow.value-2];
	var child = r.childNodes;
	child[0].innerHTML = fName.value;
	child[1].innerHTML = lName.value
	ab.innerText = about.value;
		for (i = 0; i < (color.length); i++) {
		if (color[i].checked == true) {
			child[3].innerHTML = color[i].value;
			child[3].className = color[i].value;
		}
	}
	editForm.style.display='none';
});


//функция сортировки
function sort(n) {
	if (editForm.style.display == 'inline-block') {
		return alert('Закончите редактирование');
	}
	var rows, a, b, c = 0;
	var sorting = true;
	var dir = 'asc';	
	//удаление знака сортировки у всех заголовков
	var r = table.getElementsByTagName('th');
	for (var j = 0; j < r.length; j++) {
		if (r[j].classList.contains('sorted_asc')) {
			r[j].classList.remove('sorted_asc');
		}
		if (r[j].classList.contains('sorted_desc')) {
			r[j].classList.remove('sorted_desc');
		}
	}
	//сортировка
	while (sorting) {
    sorting = false;
    rows = table.getElementsByTagName('tr');
	//проходимся по всем строкам, кроме заголовков и кнопок
    for (i = 2; i <= (rows.length - 2); i++) {
      a = rows[i].getElementsByTagName('td')[n];
      b = rows[i + 1].getElementsByTagName('td')[n];

      if (dir == 'asc') {
        if (a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase()) {
			//меняем местами 
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			sorting = true;
			c ++;
			break;
        }
      } else if (dir == 'desc') {
			if (a.innerHTML.toLowerCase() < b.innerHTML.toLowerCase()) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			sorting = true;
			c ++;
			break;
			}
		}
    }
      if (c == 0 && dir == 'asc') {
        dir = 'desc';
        sorting = true;
      }
  }
  //обновляем страницу после сортировки
  viewPage(curPage);
  //устанавливаем флажок текущей сортировки ↑ или ↓
   if (dir == 'asc') {
	      r[n].className = 'sorted_asc';
   } else {r[n].className = 'sorted_desc';}
}

//функция для показа/скрытия колонок
function changeView(b) {
	if(b.innerHTML == '-') {
		for (i = 1; i < (table.rows.length); i++) {
		table.rows[i].cells[b.parentNode.cellIndex].style.visibility = 'collapse';
		}
		b.innerHTML = '+';
	} else {
		for (i = 1; i < (table.rows.length); i++) {
		table.rows[i].cells[b.parentNode.cellIndex].style.visibility = 'visible';
		}
		b.innerHTML = '-';
	};
}