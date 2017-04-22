// var HOSTURL = "https://young-retreat-32343.herokuapp.com/todo";
var HOSTURL = "http://localhost:3000/todo";

var form = document.querySelector('.add_newtask_form');
var task_list = document.querySelector('#task_list');

//	create a task list element <li class="list-group-item"></li>
var task_elmt = document.createElement("li");

//	add class "list-group-item" to the list item
task_elmt.setAttribute("class", 'list-group-item');

//	create a new span element
var delete_span = document.createElement('span');
var complete_span = document.createElement('span');

//	add class "glyphicon glyphicon-trash" to the list item
delete_span.setAttribute("class", "glyphicon glyphicon-trash");

//	add class "glyphicon glyphicon-ok" to the list item
complete_span.setAttribute("class", "glyphicon glyphicon-ok");

//	form onsubmit
form.addEventListener('submit', function(e) {
	e.preventDefault();

	var obj = getFormData();
	
	if(obj.task!==undefined)
	{
		addTask(obj);
		form.reset();
	}

	return false;
});

function createNewEntry(task_body, isCompleted)
{
	var new_task_elmt = task_elmt.cloneNode(true);	// true makes all child node to be cloned as well
	
	// 	add text to the list item
	var new_text_node = document.createTextNode(task_body);
	new_task_elmt.appendChild(new_text_node);

	if(isCompleted)
	{
		//	add class "list-group-item" to the list item
		new_task_elmt.setAttribute("class", "list-group-item-success");
	}

	var new_delete_span = delete_span.cloneNode(true);

	new_delete_span.task = task_body;
	new_delete_span.parent = new_task_elmt;
	new_delete_span.addEventListener('click', deleteTask, false);

	var new_complete_span = complete_span.cloneNode(true);

	new_complete_span.task = task_body;
	new_complete_span.parent = new_task_elmt;
	new_complete_span.addEventListener('click', completeTask, false);

	new_task_elmt.appendChild(new_delete_span);
	new_task_elmt.appendChild(new_complete_span);
	new_task_elmt.appendChild(new_text_node);
	task_list.appendChild(new_task_elmt);
}

//	retrive all the tasks from the database
function getAllTasks()
{
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET", HOSTURL+"/allTasks", true);

	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			console.log(this.responseText);
			var res = JSON.parse(this.responseText);
			
			for (var i = 0; i < res.length; ++i) {
				createNewEntry(res[i].task, res[i].completed);
			}
		}
	};

	xhttp.send();
};

getAllTasks();

//	get the form data to be submitted to database
function getFormData()
{
	var elements = form.elements;

	var formData ={};

	for(var i = 0 ; i < elements.length ; i++){
		var item = elements.item(i);
		if(item.name!="" && item.value!="")
			formData[item.name] = item.value;
	}
	return formData;
}

//	create a new task in the database
function addTask(newTask)
{
	var xhttp = new XMLHttpRequest();

	xhttp.open("POST", HOSTURL, true);
	xhttp.setRequestHeader('Content-Type', 'application/json');

	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			createNewEntry(newTask.task, false);
		}
	};
	xhttp.send(JSON.stringify(newTask));
}

//	deleted a task from database
function deleteTask(evt)
{
	var delete_task = evt.target.task;
	var xhttp = new XMLHttpRequest();

	xhttp.open("DELETE", HOSTURL, true);
	xhttp.setRequestHeader('Content-Type', 'application/json');

	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			evt.target.parent.style.display = "none";
			console.log(this.responseText);
		}
	};

	xhttp.send(JSON.stringify({ task: delete_task }));
}

//	completed a task from database
function completeTask(evt)
{
	var complete_task = evt.target.task;
	var xhttp = new XMLHttpRequest();

	xhttp.open("PUT", HOSTURL, true);
	xhttp.setRequestHeader('Content-Type', 'application/json');

	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			evt.target.parent.classList.add("list-group-item-success");
			console.log(this.responseText);
		}
	};

	xhttp.send(JSON.stringify({ task: complete_task }));
}