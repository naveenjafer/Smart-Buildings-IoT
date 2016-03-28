'use strict';
const electron = require('electron');
const apps = electron.app;


// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	//debugger;
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);
	return win;
}

apps.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		apps.quit();
	}
});

apps.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

apps.on('ready', () => {
	mainWindow = createMainWindow();
});
