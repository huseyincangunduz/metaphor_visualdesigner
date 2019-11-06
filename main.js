const { app, BrowserWindow, Menu, dialog } = require('electron');
const { protocol } = require('electron')
const nfs = require('fs')
const npjoin = require('path').join
const es6Path = npjoin(__dirname)



console.log(__dirname);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, show: false });

  // ve uygulamanın index.html'sini yükle.
  win.loadURL('metaphor://environment/app/index.html');
  win.on('ready-to-show', function () {
    win.show();
    win.focus();
  });
}



protocol.registerStandardSchemes(['metaphor'])

function fileToMime(fileFullPath) {
  // fileFullPath_ = fileFullPath;
  while (fileFullPath.endsWith("/")) {
    fileFullPath = fileFullPath.substring(0, fileFullPath.lastIndexOf('/'));
  }
  // if(fileFullPath.indexOf("assets/js/")> -1)
  // {
  //   return 'text/javascript';
  // }

  //console.log(fileFullPath);

  var extMimeKeys = [
    { ext: '.js'  , mime: 'text/javascript' },
    { ext: '.vue'  , mime: 'application/javascript' },
    { ext: '.html', mime: 'text/html'       },
    { ext: '.css' , mime: 'text/css'        }
  ];

  var mime = "text/plain";
  
  extMimeKeys.forEach(element => {
    if (fileFullPath.endsWith(element.ext)) {
      //console.log(element.mime);
      mime = element.mime;
    }

  });
  return mime;
}



app.on('ready', () => {

  protocol.registerBufferProtocol('metaphor', (req, cb) => {
    nfs.readFile(
      npjoin(es6Path, req.url.replace('metaphor://', '')),
      (e, b) => { cb({ mimeType: fileToMime(req.url), data: b }) }
    );

  });
  console.log("starting window");
  createWindow();
});
