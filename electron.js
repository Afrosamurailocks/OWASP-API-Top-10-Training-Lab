const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Cria a janela do navegador.
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "OWASP API Top 10 Training Lab",
    webPreferences: {
      // É seguro ter nodeIntegration como false e contextIsolation como true,
      // pois a lógica da aplicação está 100% no lado do cliente (renderer).
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Esconde a barra de menu padrão (File, Edit, etc.)
    autoHideMenuBar: true,
  });

  // e carrega o index.html do aplicativo.
  win.loadFile('index.html');

  // Opcional: Abre o DevTools. Descomente a linha abaixo para depuração.
  // win.webContents.openDevTools();
}

// Este método será chamado quando o Electron tiver finalizado
// a inicialização e estiver pronto para criar janelas do navegador.
// Algumas APIs podem ser usadas somente após este evento ocorrer.
app.whenReady().then(createWindow);

// Finaliza quando todas as janelas estiverem fechadas.
app.on('window-all-closed', () => {
  // No macOS, é comum para aplicativos e sua barra de menu
  // permanecerem ativos até que o usuário saia explicitamente com Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // No macOS, é comum recriar uma janela no aplicativo quando o
  // ícone da dock é clicado e não há outras janelas abertas.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
