import { createElementAccess } from "typescript";

var taskList:HTMLElement = document.getElementById('taskList')!;
var taskCounter:HTMLElement = document.getElementById('taskCounter')!;
var addTaskBtn:HTMLElement = document.getElementById('addBtn')!;
var taskField:HTMLInputElement = document.getElementById("taskField")! as HTMLInputElement;
var totalTasks:number;
var completedTaskCount:number = 0;
var taskFocus: HTMLDivElement;


//Testing a new task Element class
class taskElement{
    name: string;
    newTaskContent: string
    constructor(name: string, newTaskContent: string){
        this.name = name;
        this.newTaskContent = newTaskContent;
    }

    generateElement():HTMLElement{
        return document.createElement('div');
    }
}

function changeFocus(newFocus: HTMLDivElement) {
    taskFocus.style.border = 'initial'
    taskFocus = newFocus;
    taskFocus.style.border = 'solid gray'
    taskFocus.style.borderWidth = '2px'
    taskFocus.style.borderRadius = '5px'
    taskField.focus();
    updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount);
}

function addNewTask() {
    var newTaskContent = taskField.value;
    if (newTaskContent !== ''){
        let newTask = document.createElement("div");
        newTask.setAttribute("class", "task");
        newTask.innerHTML = generateNewTask(newTaskContent)
        taskFocus.getElementsByClassName('childTaskContainer')[0].appendChild(newTask);
        taskField.value = '';
        taskField.focus();

        totalTasks += 1
        updateTaskCounter(totalTasks, completedTaskCount);
        updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount)
    }
}

//Call this to update the taskCounter p tag:
//updateTaskCounter(totalTasks, completedTaskCount)

function updateTaskCounter(totalTasks: number, completedTaskCount: number){
    let plural = (totalTasks - completedTaskCount) === 1 ? "" : "s"
    taskCounter.innerHTML = "You have " + (totalTasks - completedTaskCount) + " task" + plural + " left to complete.";
}

//Use this to update the local storage: 
//updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount)

function updateLocalStorage(htmlData: string, totalTasks: number, completedTaskCount: number) {
    localStorage.setItem('htmlData', htmlData)
    localStorage.setItem('totalTasks', String(totalTasks))
    localStorage.setItem('completedTaskCount', String(completedTaskCount))
}

//Generates the HTML for a new task element, returns the HTML as a string

function generateNewTask(newTaskContent: string):string {
    let newTask = "<div class='parentTaskContainer'><div class = 'btn' clicked = 'false'>o</div><p class='taskContent' completed = 'false'>" + newTaskContent + "</p><div class = 'dlt'>X</div></div><div class='childTaskContainer'></div>"
    return newTask;
}

window.onload = function() {
    console.log("Hello World!")
    if (localStorage.length !== 0){
        taskList.innerHTML = localStorage.getItem('htmlData')!
        totalTasks = Number(localStorage.getItem('totalTasks'))
        completedTaskCount = Number(localStorage.getItem('completedTaskCount'))
    }else{
        totalTasks = document.getElementsByClassName("tasks").length - 1;
    }

    for (let task = 0; task < document.getElementsByClassName("task").length; task++) {
        let thisTask: HTMLDivElement = document.getElementsByClassName("task")[task] as HTMLDivElement;
        thisTask.style.border = 'initial';
    }

    if (document.getElementsByClassName('task')[0] != null){
        taskFocus = document.getElementsByClassName('task')[0] as HTMLDivElement;
        taskFocus.style.border = 'solid gray';
        taskFocus.style.borderWidth = '2px';
        taskFocus.style.borderRadius = '5px';
    }
    
    updateTaskCounter(totalTasks, completedTaskCount);
};

taskList.addEventListener('mousedown', function (event) {
    if (event.target instanceof HTMLElement){
        if (event.target.className === 'btn'){
            event.target.style.backgroundColor = 'cyan';
        }
    }
});

taskList.addEventListener('click', function (event) {
    if (event.target instanceof HTMLElement && event.target.parentElement && event.target.parentElement.getElementsByClassName("taskContent")[0] as HTMLElement){
        var clickedObject:HTMLElement = event.target;
        var clickedObjectParent:HTMLDivElement = clickedObject.parentElement as HTMLDivElement;
        var clickedObjectTask:HTMLDivElement = clickedObjectParent.parentElement as HTMLDivElement;
        var clickedObjectParentLabel:HTMLParagraphElement = clickedObjectParent.getElementsByClassName("taskContent")[0] as HTMLParagraphElement

        //Code that handels radio button presses
        //If button clicked === 'false' make true, otherwise do opposite
        if (clickedObject.className === 'btn'){
            clickedObject.setAttribute('clicked', event.target.getAttribute('clicked') === 'false' ? 'true' : 'false');
            if (clickedObject.getAttribute('clicked') === 'true') {
                clickedObjectParentLabel.style.color = 'gray';
                clickedObjectParentLabel.setAttribute('completed', 'true')
                clickedObject.style.backgroundColor = 'blue';
                clickedObject.style.color = 'white';
                completedTaskCount++;
            } else {
                clickedObjectParentLabel.style.color = 'black'
                clickedObjectParentLabel.setAttribute('completed', 'false')
                clickedObject.style.backgroundColor = 'white';
                clickedObject.style.color = 'black';
                completedTaskCount--;
            }
            updateTaskCounter(totalTasks, completedTaskCount);
            updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount)
        }
    
        //Delete case for tasks
        //Calculates and calls the storage, also updates the task counter
        if (event.target.className === 'dlt'){
            let newCompletedTasks = 0;
            let newTotalTasks = clickedObjectTask.getElementsByClassName('childTaskContainer');
            totalTasks -= newTotalTasks.length;
    
            for (let child = 0; child < newTotalTasks.length; child++) {
                var element:HTMLElement = clickedObjectTask.getElementsByClassName('childTaskContainer')[child] as HTMLElement;
                console.log(element.parentElement!.getElementsByClassName('btn')[0]);
                newCompletedTasks += element.parentElement!.getElementsByClassName('btn')[0].getAttribute('clicked') === 'true' ? 1 : 0;
            }
            completedTaskCount -= newCompletedTasks;
            
            if (clickedObjectTask.parentElement !== null && clickedObjectTask.parentElement.parentElement !== null){
                let outerFocus:HTMLDivElement = clickedObjectTask.parentElement.parentElement as HTMLDivElement;
                changeFocus(outerFocus);
            }
            clickedObjectTask.remove();
            updateTaskCounter(totalTasks, completedTaskCount);
            updateLocalStorage(taskList.innerHTML, totalTasks, completedTaskCount);
        }
    
        //Changing the task focus. checks by checking the task name has been clicked
        if (event.target.className === 'taskContent') {
            changeFocus(clickedObjectTask)
        }
    }
});

addTaskBtn.addEventListener('click', function(){
    addNewTask()
})

taskField.addEventListener('keydown', function(event){
    if (event.key === 'Enter'){
        addNewTask();
    }
})