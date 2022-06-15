"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var taskList = document.getElementById('taskList');
var taskCounter = document.getElementById('taskCounter');
var addTaskBtn = document.getElementById('addBtn');
var taskField = document.getElementById("taskField");
var totalTasks;
var completedTaskCount = 0;
var taskFocus;
//Testing a new task Element class
class taskElement {
    constructor(name, newTaskContent) {
        this.name = name;
        this.newTaskContent = newTaskContent;
    }
    generateElement() {
        return document.createElement('div');
    }
}
function changeFocus(newFocus) {
    taskFocus.style.border = 'initial';
    taskFocus = newFocus;
    taskFocus.style.border = 'solid gray';
    taskFocus.style.borderWidth = '2px';
    taskFocus.style.borderRadius = '5px';
    taskField.focus();
    updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount);
}
function addNewTask() {
    var newTaskContent = taskField.value;
    if (newTaskContent !== '') {
        let newTask = document.createElement("div");
        newTask.setAttribute("class", "task");
        newTask.innerHTML = generateNewTask(newTaskContent);
        taskFocus.getElementsByClassName('childTaskContainer')[0].appendChild(newTask);
        taskField.value = '';
        taskField.focus();
        totalTasks += 1;
        updateTaskCounter(totalTasks, completedTaskCount);
        updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount);
    }
}
//Call this to update the taskCounter p tag:
//updateTaskCounter(totalTasks, completedTaskCount)
function updateTaskCounter(totalTasks, completedTaskCount) {
    let plural = (totalTasks - completedTaskCount) === 1 ? "" : "s";
    taskCounter.innerHTML = "You have " + (totalTasks - completedTaskCount) + " task" + plural + " left to complete.";
}
//Use this to update the local storage: 
//updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount)
function updateLocalStorage(htmlData, totalTasks, completedTaskCount) {
    localStorage.setItem('htmlData', htmlData);
    localStorage.setItem('totalTasks', String(totalTasks));
    localStorage.setItem('completedTaskCount', String(completedTaskCount));
}
//Generates the HTML for a new task element, returns the HTML as a string
function generateNewTask(newTaskContent) {
    let newTask = "<div class='parentTaskContainer'><div class = 'btn' clicked = 'false'>o</div><p class='taskContent' completed = 'false'>" + newTaskContent + "</p><div class = 'dlt'>X</div></div><div class='childTaskContainer'></div>";
    return newTask;
}
window.onload = function () {
    console.log("Hello World!");
    if (localStorage.length !== 0) {
        taskList.innerHTML = localStorage.getItem('htmlData');
        totalTasks = Number(localStorage.getItem('totalTasks'));
        completedTaskCount = Number(localStorage.getItem('completedTaskCount'));
    }
    else {
        totalTasks = document.getElementsByClassName("tasks").length - 1;
    }
    for (let task = 0; task < document.getElementsByClassName("task").length; task++) {
        let thisTask = document.getElementsByClassName("task")[task];
        thisTask.style.border = 'initial';
    }
    if (document.getElementsByClassName('task')[0] != null) {
        taskFocus = document.getElementsByClassName('task')[0];
        taskFocus.style.border = 'solid gray';
        taskFocus.style.borderWidth = '2px';
        taskFocus.style.borderRadius = '5px';
    }
    updateTaskCounter(totalTasks, completedTaskCount);
};
taskList.addEventListener('mousedown', function (event) {
    if (event.target instanceof HTMLElement) {
        if (event.target.className === 'btn') {
            event.target.style.backgroundColor = 'cyan';
        }
    }
});
taskList.addEventListener('click', function (event) {
    if (event.target instanceof HTMLElement && event.target.parentElement && event.target.parentElement.getElementsByClassName("taskContent")[0]) {
        var clickedObject = event.target;
        var clickedObjectParent = clickedObject.parentElement;
        var clickedObjectTask = clickedObjectParent.parentElement;
        var clickedObjectParentLabel = clickedObjectParent.getElementsByClassName("taskContent")[0];
        //Code that handels radio button presses
        //If button clicked === 'false' make true, otherwise do opposite
        if (clickedObject.className === 'btn') {
            clickedObject.setAttribute('clicked', event.target.getAttribute('clicked') === 'false' ? 'true' : 'false');
            if (clickedObject.getAttribute('clicked') === 'true') {
                clickedObjectParentLabel.style.color = 'gray';
                clickedObjectParentLabel.setAttribute('completed', 'true');
                clickedObject.style.backgroundColor = 'blue';
                clickedObject.style.color = 'white';
                completedTaskCount++;
            }
            else {
                clickedObjectParentLabel.style.color = 'black';
                clickedObjectParentLabel.setAttribute('completed', 'false');
                clickedObject.style.backgroundColor = 'white';
                clickedObject.style.color = 'black';
                completedTaskCount--;
            }
            updateTaskCounter(totalTasks, completedTaskCount);
            updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount);
        }
        //Delete case for tasks
        //Calculates and calls the storage, also updates the task counter
        if (event.target.className === 'dlt') {
            let newCompletedTasks = 0;
            let newTotalTasks = clickedObjectTask.getElementsByClassName('childTaskContainer');
            totalTasks -= newTotalTasks.length;
            for (let child = 0; child < newTotalTasks.length; child++) {
                var element = clickedObjectTask.getElementsByClassName('childTaskContainer')[child];
                console.log(element.parentElement.getElementsByClassName('btn')[0]);
                newCompletedTasks += element.parentElement.getElementsByClassName('btn')[0].getAttribute('clicked') === 'true' ? 1 : 0;
            }
            completedTaskCount -= newCompletedTasks;
            if (clickedObjectTask.parentElement !== null && clickedObjectTask.parentElement.parentElement !== null) {
                let outerFocus = clickedObjectTask.parentElement.parentElement;
                changeFocus(outerFocus);
            }
            clickedObjectTask.remove();
            updateTaskCounter(totalTasks, completedTaskCount);
            updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount);
        }
        //Changing the task focus. checks by checking the task name has been clicked
        if (event.target.className === 'taskContent') {
            changeFocus(clickedObjectTask);
        }
    }
});
addTaskBtn.addEventListener('click', function () {
    addNewTask();
});
taskField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addNewTask();
    }
});
