const { app, BrowserWindow } = require( 'electron' );
const { autoUpdater } = require( 'electron-updater' );
const path = require( 'path' );
const url = require( 'url' );

const ELECTRON_START_URL = process.env.NODE_ENV === 'production' ?
  url.format( {
    pathname: path.join( __dirname, '/../build/index.html' ),
    protocol: 'file',
    slashes: true
  } )
  :
  'http://localhost:3000';

let window;

function createWindow()
{
  window = new BrowserWindow( {
    width: 800,
    height: 600,
    show: false,
    backgroundColor: "#f5f5f5"
  } );

  window.loadURL( ELECTRON_START_URL );

  window.on( 'closed', () =>
  {
    window = null;
  } );

  window.once( 'ready-to-show', () =>
  {
    window.show();
  } );
}

app.on( 'ready', () =>
{
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();
} );

app.on( 'window-all-closed', () =>
{
  if( process.platform !== 'darwin' )
  {
    app.quit();
  }
} );

app.on( 'activate', () =>
{
  if( window === null )
  {
    createWindow();
  }
} );
