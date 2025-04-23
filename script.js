const fs = require('fs');
const readline = require('readline');
const { EventEmitter } = require('events');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class TaskManager extends EventEmitter {
    constructor() {
        super();
        this.tasks = []; 
        this.counter = 1;
    }

    addTask(tasktxt) {
        const task = { id: this.counter++, text: tasktxt };
        this.tasks.push(task);
        const line = `${task.id}. ${task.text}`;
        fs.appendFile('txt.txt', line + '\n', (err) => {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('You added a task:', task);
                this.emit('taskAdded', task);
            }
        });
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            const deleted = this.tasks.splice(index, 1)[0];
            fs.writeFile('txt.txt', this.tasks.map(task => `${task.id}. ${task.text}`).join('\n'), (err) => {
                if (err) {
                    console.log('ERROR:', err);
                } else {
                    console.log(`Deleted task: "${deleted.text}"`);
                }
            });
        } else {
            console.log('Task is not found');
        }
    }
}

const taskManager = new TaskManager();

taskManager.on('taskAdded', (task) => {
    console.log(`(Event) Task "${task.text}" was added to the file.`);
});

console.log('Type a task and press Enter. Type "delete <id>" to delete. Type "quit" to finish.');

rl.on('line', (input) => {
    const trimmed = input.trim();
    if (trimmed.toLowerCase() === 'quit') {
        console.log('Goodbye');
        rl.close();
        return;
    }

    if (trimmed.startsWith('delete')) {
        const id = parseInt(trimmed.split(' ')[1]);
        if (!isNaN(id)) {
            taskManager.deleteTask(id);
        } else {
            console.log('Provide a valid task ID to delete');
        }
    } else {
        taskManager.addTask(trimmed);
    }
});
