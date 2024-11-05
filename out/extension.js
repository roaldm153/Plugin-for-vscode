"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const MINUTE = 60000;
let timerDuration = 20;
let timer = null;
let timerMinutesLeft = timerDuration;
let statusBarMessage;
let IsWorking = false;
function activate(context) {
    let setTimeCmd = vscode.commands.registerCommand('timer.settime', setTimerDuration);
    let startTimerCmd = vscode.commands.registerCommand('timer.start', startTimer);
    let stopTimerCmd = vscode.commands.registerCommand('timer.stop', showStopMessage);
    let killTimerCmd = vscode.commands.registerCommand('timer.kill', killTimerProcess);
    context.subscriptions.push(setTimeCmd);
    context.subscriptions.push(startTimerCmd);
    context.subscriptions.push(stopTimerCmd);
}
function deactivate() { }
;
function setTimerDuration() {
    let options = { title: "Время между зачилами", prompt: "введите время в минутах", value: "20" };
    vscode.window.showInputBox(options).then((result) => {
        let minutes = parseInt(result ?? "0");
        timerDuration = minutes;
        timerMinutesLeft = timerDuration;
    });
}
async function startTimer() {
    IsWorking = true;
    updateTimer();
    timer = setInterval(updateTimer, MINUTE);
}
async function killTimerProcess() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
        timerMinutesLeft = timerDuration;
        if (statusBarMessage) {
            statusBarMessage.dispose();
        }
    }
}
async function updateTimer() {
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
async function showStopMessage() {
    await killTimerProcess();
    statusBarMessage = vscode.window.setStatusBarMessage("Пацаны, зачильтесь на Вязьме");
}
//# sourceMappingURL=extension.js.map