const { app, BrowserWindow, session } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "OWASP API Top 10 Training Lab",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Habilita o sandbox para o processo de renderização. Esta é uma medida de segurança crucial.
      sandbox: true,
    },
    autoHideMenuBar: true,
  });

  win.loadFile('index.html');

  // Abre o DevTools apenas em modo de desenvolvimento para depuração.
  // Em produção (quando o app está empacotado), ele permanecerá fechado.
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

// Aplica políticas de segurança rigorosas para proteger a aplicação.
const applySecurityPolicies = () => {
    // Implementa uma Política de Segurança de Conteúdo (CSP) para mitigar ataques de cross-site scripting (XSS).
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    // Restringe de onde os objetos (como <embed> ou <object>) podem ser carregados. 'none' bloqueia todos.
                    "object-src 'none';",
                    // Define as fontes permitidas para scripts. 'self' refere-se aos arquivos locais da aplicação.
                    "script-src 'self' https://cdn.tailwindcss.com https://esm.sh;",
                    // Define as fontes permitidas para estilos. 'unsafe-inline' é necessário para o Tailwind JIT e estilos no componente React.
                    "style-src 'self' 'unsafe-inline';",
                    // Define as fontes permitidas para imagens.
                    "img-src 'self' data: https://picsum.photos;",
                    // Restringe as URLs que podem ser conectadas via scripts.
                    "connect-src 'self' https://generativelanguage.googleapis.com https://aistudio.google.com;",
                    // Impede que formulários enviem dados para qualquer lugar.
                    "form-action 'none';",
                    // Impede que a página seja embutida em iframes em outros sites.
                    "frame-ancestors 'none';",
                    // Restringe o uso da tag <base>.
                    "base-uri 'none';"
                ].join(' ')
            }
        });
    });

    // Nega todas as solicitações de permissão (câmera, microfone, etc.) por padrão,
    // pois a aplicação não precisa de nenhuma delas.
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        callback(false);
    });
};

app.whenReady().then(() => {
    applySecurityPolicies();
    createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Medidas de segurança adicionais para controlar o comportamento das janelas.
app.on('web-contents-created', (event, contents) => {
    // Impede a navegação para fora do contexto da aplicação.
    // Qualquer tentativa de navegar para uma URL externa ou outro arquivo local será bloqueada.
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault();
    });

    // Impede a abertura de novas janelas ou abas (window.open).
    // Isso protege contra pop-ups maliciosos.
    contents.setWindowOpenHandler(({ url }) => {
        return { action: 'deny' };
    });
});