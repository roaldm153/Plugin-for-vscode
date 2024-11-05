import * as vscode from 'vscode';

const MINUTE = 60000;
let timerDuration: number = 20;
let timer: ReturnType<typeof setInterval> | null = null;
let timerMinutesLeft: number = timerDuration;
let statusBarMessage: vscode.Disposable;
let IsWorking: boolean = false;

export function activate(context: vscode.ExtensionContext) {

	let setTimeCmd = vscode.commands.registerCommand('timer.settime', setTimerDuration);
	let startTimerCmd = vscode.commands.registerCommand('timer.start', startTimer);
	let stopTimerCmd = vscode.commands.registerCommand('timer.stop', showStopMessage);
	let killTimerCmd = vscode.commands.registerCommand('timer.kill', killTimerProcess);

	context.subscriptions.push(setTimeCmd);
	context.subscriptions.push(startTimerCmd);
	context.subscriptions.push(stopTimerCmd);
}

export function deactivate() {};

function setTimerDuration(): void {
	let options:  vscode.InputBoxOptions = {title: "Время между зачилами", prompt: "введите время в минутах", value: "20"};
    vscode.window.showInputBox(options).then((result) => {
        let minutes = parseInt(result ?? "0");
        timerDuration = minutes;
        timerMinutesLeft = timerDuration;
    });
}

async function startTimer(): Promise<void> {
	IsWorking = true;
    updateTimer();
    timer = setInterval(updateTimer, MINUTE);
}

async function killTimerProcess(): Promise<void> {
	if (timer !== null) {
		clearInterval(timer);
		timer = null;
		timerMinutesLeft = timerDuration;
		if (statusBarMessage) {
			statusBarMessage.dispose();
		}
	}
}

async function updateTimer(): Promise<void> {
	if (timerMinutesLeft === 0) {
        await showStopMessage();
		return;
	}
	if (statusBarMessage) {
		statusBarMessage.dispose();
	}
	statusBarMessage = vscode.window.setStatusBarMessage(`Зачил на Вязьме через ${timerMinutesLeft} мин`);
	timerMinutesLeft--;
}

async function showStopMessage(): Promise<void> {
    await killTimerProcess();
    statusBarMessage = vscode.window.setStatusBarMessage("Пацаны, зачильтесь на Вязьме");
}

